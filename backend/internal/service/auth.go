package service

import (
	"context"
	"errors"
	"time"

	"github.com/forkfall/backend/internal/domain"
	"github.com/forkfall/backend/internal/repository/postgres"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type AuthService struct {
	actorRepo *postgres.ActorRepository
	jwtSecret []byte
}

func NewAuthService(actorRepo *postgres.ActorRepository, jwtSecret string) *AuthService {
	return &AuthService{
		actorRepo: actorRepo,
		jwtSecret: []byte(jwtSecret),
	}
}

type AuthResult struct {
	Token   string
	ActorID uuid.UUID
	IsNew   bool
}

func (s *AuthService) AuthenticateDevice(ctx context.Context, deviceFingerprint string) (*AuthResult, error) {
	// Try to find existing actor
	actor, err := s.actorRepo.GetByDeviceFingerprint(ctx, deviceFingerprint)
	isNew := false

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Create new actor
			actor = domain.NewActor(deviceFingerprint)
			if err := s.actorRepo.Create(ctx, actor); err != nil {
				return nil, err
			}
			isNew = true
		} else {
			return nil, err
		}
	}

	// Check if actor is active
	if !actor.IsActive() {
		return nil, domain.ErrUnauthorized
	}

	// Generate JWT
	token, err := s.generateToken(actor.ID)
	if err != nil {
		return nil, err
	}

	return &AuthResult{
		Token:   token,
		ActorID: actor.ID,
		IsNew:   isNew,
	}, nil
}

func (s *AuthService) generateToken(actorID uuid.UUID) (string, error) {
	claims := jwt.MapClaims{
		"actor_id": actorID.String(),
		"exp":      time.Now().Add(30 * 24 * time.Hour).Unix(), // 30 days
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func (s *AuthService) GetActor(ctx context.Context, actorID uuid.UUID) (*domain.Actor, error) {
	return s.actorRepo.GetByID(ctx, actorID)
}
