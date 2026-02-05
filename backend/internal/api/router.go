package api

import (
	"net/http"
	"time"

	"github.com/forkfall/backend/internal/api/handlers"
	"github.com/forkfall/backend/internal/api/middleware"
	"github.com/forkfall/backend/internal/service"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func NewRouter(
	authService *service.AuthService,
	feedService *service.FeedService,
	forkService *service.ForkService,
	jwtSecret string,
) http.Handler {
	r := chi.NewRouter()

	// Global middleware
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.Timeout(30 * time.Second))

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(authService)
	feedHandler := handlers.NewFeedHandler(feedService)
	forkHandler := handlers.NewForkHandler(forkService)
	intentHandler := handlers.NewIntentHandler()

	// Auth middleware
	authMiddleware := middleware.NewAuthMiddleware(jwtSecret)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok"}`))
	})

	// API v1 routes
	r.Route("/api/v1", func(r chi.Router) {
		// Public routes
		r.Post("/auth/device", authHandler.DeviceAuth)

		// Protected routes
		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.Authenticate)

			// Feed
			r.Get("/feed", feedHandler.GetFeed)

			// Forks
			r.Post("/forks", forkHandler.CreateFork)
			r.Get("/forks/{id}", forkHandler.GetFork)
			r.Post("/forks/{id}/interact", forkHandler.Interact)
			r.Post("/forks/{id}/report", forkHandler.Report)

			// Intents
			r.Get("/intents", intentHandler.GetIntents)

			// Session
			r.Put("/session", feedHandler.UpdateSession)
		})
	})

	return r
}
