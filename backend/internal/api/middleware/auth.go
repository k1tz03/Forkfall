package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type contextKey string

const ActorIDKey contextKey = "actor_id"

type AuthMiddleware struct {
	jwtSecret []byte
}

func NewAuthMiddleware(jwtSecret string) *AuthMiddleware {
	return &AuthMiddleware{
		jwtSecret: []byte(jwtSecret),
	}
}

func (m *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error":"missing authorization header"}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			http.Error(w, `{"error":"invalid authorization header format"}`, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return m.jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, `{"error":"invalid token"}`, http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, `{"error":"invalid token claims"}`, http.StatusUnauthorized)
			return
		}

		actorIDStr, ok := claims["actor_id"].(string)
		if !ok {
			http.Error(w, `{"error":"missing actor_id in token"}`, http.StatusUnauthorized)
			return
		}

		actorID, err := uuid.Parse(actorIDStr)
		if err != nil {
			http.Error(w, `{"error":"invalid actor_id format"}`, http.StatusUnauthorized)
			return
		}

		// Add actor ID to context
		ctx := context.WithValue(r.Context(), ActorIDKey, actorID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetActorID extracts the actor ID from the request context
func GetActorID(ctx context.Context) (uuid.UUID, bool) {
	actorID, ok := ctx.Value(ActorIDKey).(uuid.UUID)
	return actorID, ok
}
