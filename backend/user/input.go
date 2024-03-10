package user

type RegisterUserInput struct {
	Name string `json:"name" binding:"required"`
	// Role     string `json:"role"`
	Image    string `json:"image" `
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type CheckEmailInput struct {
	Email string `json:"email" binding:"required"`
}

type FormCreateUserInput struct {
	Name     string `form:"name" binding:"required"`
	Email    string `form:"email" binding:"required,email"`
	Role     string `form:"occupation" binding:"required"`
	Password string `form:"password" binding:"required"`
	Error    error
}

type FormUpdateUserInput struct {
	ID    int
	Name  string `form:"name" binding:"required"`
	Email string `form:"email" binding:"required,email"`
	Role  string `form:"role" binding:"required"`
	Error error
}