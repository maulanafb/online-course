package handler

import (
	"be_online_course/auth"
	"be_online_course/helper"
	"be_online_course/user"
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/oauth2"

	"github.com/joho/godotenv"

	"google.golang.org/api/idtoken"
)

type UserHandler struct {
	userService user.Service
	authService auth.Service
}

// Google OAuth Configuration
type GoogleOAuthConfig struct {
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
	RedirectURL  string `json:"redirect_url"`
}

var (
	googleOAuthConfig GoogleOAuthConfig
	googleOauthClient *oauth2.Config
)

func NewUserHandler(userService user.Service, authService auth.Service) *UserHandler {
	return &UserHandler{userService, authService}
}

func (h *UserHandler) RegisterUser(c *fiber.Ctx) error {
	var input user.RegisterUserInput
	if err := c.BodyParser(&input); err != nil {
		errors := helper.FormatValidationError(err)
		errorMessage := fiber.Map{"errors": errors}
		response := helper.FiberAPIResponse(c, "Register account failedd", http.StatusUnprocessableEntity, "error", errorMessage)
		return response
	}
	checkEmail, err := h.userService.CheckingEmail(input.Email)
	// fmt.Println(checkEmail, err)
	if err != nil {
		return err
	}
	if checkEmail.Email == input.Email {
		response := helper.FiberAPIResponse(c, "Email Already Registered", http.StatusBadRequest, "error", nil)
		return response
	}
	newUser, err := h.userService.RegisterUser(input)
	if err != nil {
		response := helper.FiberAPIResponse(c, "Register account failed", http.StatusBadRequest, "error", nil)
		return response
	}

	token, err := h.authService.GenerateToken(newUser.ID)
	if err != nil {
		response := helper.FiberAPIResponse(c, "Register account failed", http.StatusBadRequest, "error", nil)
		return response
	}
	formatter := user.FormatUser(newUser, token)
	response := helper.FiberAPIResponse(c, "Account successfully registered", http.StatusOK, "success", formatter)
	return response
}

func (h *UserHandler) Login(c *fiber.Ctx) error {
	var input user.LoginInput
	if err := c.BodyParser(&input); err != nil {
		errors := helper.FormatValidationError(err)
		errorMessage := fiber.Map{"errors": errors}
		response := helper.FiberAPIResponse(c, "Login failed", http.StatusUnprocessableEntity, "error", errorMessage)
		return response
	}

	loggedinUser, err := h.userService.Login(input)

	if err != nil {
		errors := helper.FormatValidationError(err)
		errorMessage := fiber.Map{"errors": errors}
		response := helper.FiberAPIResponse(c, "Login failed", http.StatusUnprocessableEntity, "error", errorMessage)
		return response
	}

	token, err := h.authService.GenerateToken(loggedinUser.ID)
	if err != nil {
		response := helper.FiberAPIResponse(c, "Login failed", http.StatusBadRequest, "error", nil)
		return response
	}

	// Set HTTP-only cookie in the response
	c.Cookie(&fiber.Cookie{
		Name:  "your_cookie_name", // Set your desired cookie name
		Value: token,
		// HTTPOnly: true,
	})

	formatter := user.FormatUser(loggedinUser, token)
	response := helper.FiberAPIResponse(c, "Login success", http.StatusOK, "success", formatter)
	return response
}

func (h *UserHandler) CheckEmailAvailability(c *fiber.Ctx) error {
	var input user.CheckEmailInput
	if err := c.BodyParser(&input); err != nil {
		errors := helper.FormatValidationError(err)
		errorMessage := fiber.Map{"errors": errors}
		response := helper.FiberAPIResponse(c, "Email checking failed", http.StatusUnprocessableEntity, "error", errorMessage)
		return response
	}

	isEmailAvailable, err := h.userService.IsEmailAvailable(input)
	if err != nil {
		errorMessage := fiber.Map{"errors": "Server error"}
		response := helper.FiberAPIResponse(c, "Email Already Registered", http.StatusUnprocessableEntity, "error", errorMessage)
		return response
	}

	data := fiber.Map{"is_available": isEmailAvailable}
	metaMessage := "Email has been registered"
	if isEmailAvailable {
		metaMessage = "Email is available"
	}

	response := helper.FiberAPIResponse(c, metaMessage, http.StatusOK, "success", data)
	return response
}

func (h *UserHandler) UploadAvatar(c *fiber.Ctx) error {
	file, err := c.FormFile("avatar")
	if err != nil {
		data := fiber.Map{"is_uploaded": false}
		response := helper.FiberAPIResponse(c, "Failed to upload avatars", http.StatusBadRequest, "error", data)
		return response
	}

	currentUser := c.Locals("currentUser").(user.User)
	userID := currentUser.ID
	currentTime := time.Now().UnixNano() / int64(time.Millisecond)
	path := fmt.Sprintf("images/%d-%d-%s", userID, currentTime, file.Filename)

	err = c.SaveFile(file, path)
	if err != nil {
		data := fiber.Map{"is_uploaded": false}
		response := helper.FiberAPIResponse(c, "Failed to upload avatar", http.StatusBadRequest, "error", data)
		return response
	}

	_, err = h.userService.SaveAvatar(userID, path)
	if err != nil {
		data := fiber.Map{"is_uploaded": false}
		response := helper.FiberAPIResponse(c, "Failed to upload avatar", http.StatusBadRequest, "error", data)
		return response
	}
	data := fiber.Map{"is_uploaded": true}
	response := helper.FiberAPIResponse(c, "success upload avatar", http.StatusOK, "success", data)
	return response
}

func (h *UserHandler) FetchUser(c *fiber.Ctx) error {
	currentUser := c.Locals("currentUser").(user.User)

	formatter := user.FormatUser(currentUser, "")

	response := helper.FiberAPIResponse(c, "Successfully fetch user data", http.StatusOK, "success", formatter)

	return response
}

func (h *UserHandler) GoogleCallback(c *fiber.Ctx) error {
	tokenID := c.Query("tokenId")
	if tokenID == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing tokenId"})
	}

	// Konfigurasi untuk verifikasi token Google
	tokenValidator, err := idtoken.NewValidator(context.Background())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	const googleClientID = "555809304379-gqicb9q9fcc9iererv73cmpeuo0jp7p3.apps.googleusercontent.com" // Ganti dengan Google Client ID Anda
	payload, err := tokenValidator.Validate(context.Background(), tokenID, googleClientID)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
	}

	// Dapatkan informasi pengguna dari payload token
	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)

	// Cek apakah email sudah ada di database
	// var user user.User
	_, err = h.userService.CheckingEmail(email)
	newUser, err := h.userService.FindOrCreateUserByEmail(email, name) // Ganti user dengan newUser
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error 1"})
	}
	newUser, err = h.userService.GetUserByID(newUser.ID) // Menggunakan newUser.ID sebagai argumen
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Internal server error 2"})
	}
	fmt.Println(newUser)
	// Jika autentikasi dengan Google berhasil, hasilkan token JWT
	tokenString, err := h.authService.GenerateToken(newUser.ID)
	return c.Status(http.StatusOK).JSON(fiber.Map{"token": tokenString})
}

func generateJWTToken(userID int) string {
	// Konfigurasi untuk menghasilkan token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token berlaku selama 24 jam
	})

	// Tanda tangan token dengan kunci rahasia
	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	return tokenString
}

// func (h *UserHandler) GoogleLogin(c *fiber.Ctx) error {
// 	url := googleOauthClient.AuthCodeURL("state")

// 	return c.Redirect(url, http.StatusTemporaryRedirect)
// }

// // Handle Google OAuth callback
// func (h *UserHandler) GoogleCallback(c *fiber.Ctx) error {
// 	code := c.Query("code")

// 	token, err := googleOauthClient.Exchange(oauth2.NoContext, code)
// 	if err != nil {
// 		return err
// 	}

// 	client := googleOauthClient.Client(oauth2.NoContext, token)
// 	userInfoResp, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
// 	if err != nil {
// 		return err
// 	}
// 	defer userInfoResp.Body.Close()

// 	var userInfo struct {
// 		Email         string `json:"email"`
// 		Name          string `json:"name"`           // Full name
// 		GivenName     string `json:"given_name"`     // Optional: First name
// 		FamilyName    string `json:"family_name"`    // Optional: Last name
// 		Picture       string `json:"picture"`        // Optional: Profile picture URL
// 		EmailVerified bool   `json:"email_verified"` // Optional: Whether email is verified
// 		Locale        string `json:"locale"`         // Optional: User's locale
// 	}
// 	if err := json.NewDecoder(userInfoResp.Body).Decode(&userInfo); err != nil {
// 		return err
// 	}
// 	fmt.Println(userInfo)
// 	// Find or create user in database
// 	user, err := h.userService.FindOrCreateUserByEmail(userInfo.Email, userInfo.GivenName)

// 	if err != nil {
// 		return err
// 	}

// 	// Generate JWT token
// 	jwtToken, err := h.authService.GenerateToken(user.ID)
// 	if err != nil {
// 		return err
// 	}

// 	// Redirect user to frontend with token
// 	redirectURL := fmt.Sprintf("http://localhost:3000/auth?token=%s", jwtToken)
// 	return c.Redirect(redirectURL, http.StatusTemporaryRedirect)
// }

func init() {
	godotenv.Load()
}
