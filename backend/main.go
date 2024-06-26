package main

import (
	"be_online_course/auth"
	"be_online_course/category"
	"be_online_course/chapter"
	"be_online_course/course"
	"be_online_course/handler"
	"be_online_course/helper"
	"be_online_course/lesson"
	"be_online_course/payment"
	"be_online_course/transaction"
	"be_online_course/user"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	// must godot	env.load first
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	GormConfig := &gorm.Config{
		// ...
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	}
	dsn := "root:@tcp(localhost:3306)/be-e-course?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), GormConfig)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Println("Database connected successfully")
	fmt.Println("Database connected successfully")

	userRepository := user.NewRepository(db)
	categoryRepository := category.NewRepository(db)
	courseRepository := course.NewRepository(db)
	chapterRepository := chapter.NewRepository(db)
	lessonRepository := lesson.NewRepository(db)
	transactionRepository := transaction.NewRepository(db)

	userService := user.NewService(userRepository)
	authService := auth.NewService()
	categoryService := category.NewService(categoryRepository)
	courseService := course.NewService(courseRepository)
	chapterService := chapter.NewService(chapterRepository)
	lessonService := lesson.NewService(lessonRepository)
	paymentServlice := payment.NewService()
	transactionService := transaction.NewService(transactionRepository, courseRepository, paymentServlice)

	// Uncomment the line below to perform database migrations
	// if err := migrations.Migrate(db); err != nil {
	// 	log.Fatal(err)
	// }
	userHandler := handler.NewUserHandler(userService, authService)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	courseHandler := handler.NewCourseHandler(courseService)
	chapterHandler := handler.NewChapterHandler(chapterService)
	lessonHandler := handler.NewLessonHandler(lessonService)
	transactionHandler := handler.NewTransactionHandler(transactionService, courseRepository)

	app := fiber.New()

	// Enable CORS
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))
	app.Static("/images", "./images")

	api := app.Group("/api/v1")
	api.Post("/users", userHandler.RegisterUser)
	api.Get("/auth/google/callback", userHandler.GoogleCallback)
	api.Post("/sessions", userHandler.Login)
	api.Get("/users/fetch", authMiddleware(authService, userService), userHandler.FetchUser)

	api.Post("/category", authMiddleware(authService, userService), roleMiddleware("admin"), categoryHandler.CreateCategory)
	api.Get("/category/:title", authMiddleware(authService, userService), categoryHandler.GetCategoryByTitle)
	api.Get("/categories/", authMiddleware(authService, userService), categoryHandler.GetCategories)
	api.Put("/category/:id", authMiddleware(authService, userService), roleMiddleware("admin"), categoryHandler.UpdateCategory)
	api.Delete("/category/:id/delete", authMiddleware(authService, userService), roleMiddleware("admin"), categoryHandler.DeleteCategory)

	api.Post("/course/create", authMiddleware(authService, userService), roleMiddleware("admin"), courseHandler.CreateCourse)
	api.Get("/course/dashboard/", authMiddleware(authService, userService), transactionHandler.GetPaidCourses)
	api.Get("/courses", courseHandler.GetCourses)
	api.Get("/course/:slug", courseHandler.GetCourseBySlug)
	api.Get("/course/:slug/detail", courseHandler.GetCourseDetailBySlug)
	api.Post("/course-images", authMiddleware(authService, userService), roleMiddleware("admin"), courseHandler.UploadImage)

	api.Post("/chapter/create", authMiddleware(authService, userService), roleMiddleware("admin"), chapterHandler.CreateChapter)

	api.Post("/lesson/create", authMiddleware(authService, userService), roleMiddleware("admin"), lessonHandler.CreateLesson)

	api.Post("/transactions/notification", transactionHandler.GetNotification)
	api.Post("/transactions/:course_slug", authMiddleware(authService, userService), transactionHandler.CreateTransaction)

	app.Listen(":8088")
}

func authMiddleware(authService auth.Service, userService user.Service) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		if !strings.Contains(authHeader, "Bearer") {
			response := helper.APIResponse("Unauthorized", http.StatusUnauthorized, "error", nil)
			return c.Status(http.StatusUnauthorized).JSON(response)
		}

		tokenString := ""
		arrayToken := strings.Split(authHeader, " ")
		if len(arrayToken) == 2 {
			tokenString = arrayToken[1]
		}
		fmt.Println(tokenString)
		token, err := authService.ValidateToken(tokenString)
		if err != nil {
			response := helper.APIResponse("Unauthorized1", http.StatusUnauthorized, "error", nil)
			return c.Status(http.StatusUnauthorized).JSON(response)
		}

		claim, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			response := helper.APIResponse("Unauthorized2", http.StatusUnauthorized, "error", nil)
			return c.Status(http.StatusUnauthorized).JSON(response)
		}

		userID := int(claim["user_id"].(float64))
		user, err := userService.GetUserByID(userID)
		if err != nil {
			response := helper.APIResponse("Unauthorized3", http.StatusUnauthorized, "error", nil)
			return c.Status(http.StatusUnauthorized).JSON(response)
		}
		// Set the user in the context
		c.Locals("currentUser", user)
		return c.Next()
	}
}

func roleMiddleware(requiredRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		currentUser := c.Locals("currentUser").(user.User)
		fmt.Println(currentUser)
		if currentUser.Role != requiredRole {
			response := helper.APIResponse("Forbidden", http.StatusForbidden, "error", nil)
			return c.Status(http.StatusForbidden).JSON(response)
		}

		// donttt ask why its working :)
		return c.Next()
	}
}
