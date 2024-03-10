FROM golang:alpine 

WORKDIR /app

# Download dependencies 
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN go build -o /app/main

# Expose port
EXPOSE 8088

# Run application on container start
CMD ["/app/main"]