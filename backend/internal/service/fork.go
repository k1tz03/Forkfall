package service

import (
	"context"
	"time"

	"github.com/forkfall/backend/internal/domain"
	"github.com/forkfall/backend/internal/repository/postgres"
	"github.com/google/uuid"
)

type ForkService struct {
	forkRepo        *postgres.ForkRepository
	interactionRepo *postgres.InteractionRepository
}

func NewForkService(
	forkRepo *postgres.ForkRepository,
	interactionRepo *postgres.InteractionRepository,
) *ForkService {
	return &ForkService{
		forkRepo:        forkRepo,
		interactionRepo: interactionRepo,
	}
}

func (s *ForkService) CreateFork(ctx context.Context, actorID uuid.UUID, input domain.CreateForkInput) (*domain.Fork, error) {
	// Validate input
	if err := input.Validate(); err != nil {
		return nil, err
	}

	// Check rate limit (10 creates per hour)
	count, err := s.interactionRepo.CountByActorSince(ctx, actorID, domain.InteractionTwist, time.Now().Add(-1*time.Hour))
	if err != nil {
		return nil, err
	}
	if count >= 10 {
		return nil, domain.ErrRateLimited
	}

	// Create fork
	fork := &domain.Fork{
		ID:                uuid.New(),
		Prompt:            input.Prompt,
		LeftLabel:         input.LeftLabel,
		RightLabel:        input.RightLabel,
		IntentLane:        input.IntentLane,
		Mood:              input.Mood,
		Energy:            input.Energy,
		ParentForkID:      input.ParentForkID,
		MutationType:      input.MutationType,
		SafetyAgeGate:     "all",
		SafetySensitivity: "normal",
		SafetyFlags:       []string{},
		CreatedByActorID:  actorID,
		CreatedAt:         time.Now(),
	}

	if err := s.forkRepo.Create(ctx, fork); err != nil {
		return nil, err
	}

	return fork, nil
}

func (s *ForkService) GetFork(ctx context.Context, id uuid.UUID) (*domain.Fork, error) {
	return s.forkRepo.GetByID(ctx, id)
}

func (s *ForkService) RecordInteraction(ctx context.Context, actorID uuid.UUID, input domain.InteractionInput) error {
	// Validate interaction type
	if !domain.ValidInteractionType(input.Type) {
		return domain.ErrInvalidInput
	}

	interaction := &domain.Interaction{
		ID:        uuid.New(),
		ActorID:   actorID,
		ForkID:    input.ForkID,
		Type:      input.Type,
		DwellMs:   input.DwellMs,
		CreatedAt: time.Now(),
	}

	return s.interactionRepo.Create(ctx, interaction)
}

func (s *ForkService) ReportFork(ctx context.Context, actorID uuid.UUID, forkID uuid.UUID, reason string) error {
	report := &domain.Report{
		ID:        uuid.New(),
		ActorID:   actorID,
		ForkID:    forkID,
		Reason:    reason,
		State:     domain.ReportStatePending,
		CreatedAt: time.Now(),
	}

	return s.forkRepo.CreateReport(ctx, report)
}

func (s *ForkService) GetForkChildren(ctx context.Context, parentID uuid.UUID) ([]*domain.Fork, error) {
	return s.forkRepo.GetByParent(ctx, parentID)
}
