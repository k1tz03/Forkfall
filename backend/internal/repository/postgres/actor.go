package postgres

import (
	"context"

	"github.com/forkfall/backend/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ActorRepository struct {
	db *pgxpool.Pool
}

func NewActorRepository(db *pgxpool.Pool) *ActorRepository {
	return &ActorRepository{db: db}
}

func (r *ActorRepository) Create(ctx context.Context, actor *domain.Actor) error {
	query := `
		INSERT INTO actors (id, device_fingerprint, trust_score, status, created_at)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(ctx, query,
		actor.ID,
		actor.DeviceFingerprint,
		actor.TrustScore,
		actor.Status,
		actor.CreatedAt,
	)
	return err
}

func (r *ActorRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Actor, error) {
	query := `
		SELECT id, device_fingerprint, trust_score, status, created_at
		FROM actors
		WHERE id = $1
	`
	var actor domain.Actor
	err := r.db.QueryRow(ctx, query, id).Scan(
		&actor.ID,
		&actor.DeviceFingerprint,
		&actor.TrustScore,
		&actor.Status,
		&actor.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &actor, nil
}

func (r *ActorRepository) GetByDeviceFingerprint(ctx context.Context, fingerprint string) (*domain.Actor, error) {
	query := `
		SELECT id, device_fingerprint, trust_score, status, created_at
		FROM actors
		WHERE device_fingerprint = $1
	`
	var actor domain.Actor
	err := r.db.QueryRow(ctx, query, fingerprint).Scan(
		&actor.ID,
		&actor.DeviceFingerprint,
		&actor.TrustScore,
		&actor.Status,
		&actor.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &actor, nil
}

func (r *ActorRepository) UpdateTrustScore(ctx context.Context, id uuid.UUID, score float64) error {
	query := `
		UPDATE actors
		SET trust_score = $2
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query, id, score)
	return err
}

func (r *ActorRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `
		UPDATE actors
		SET status = $2
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query, id, status)
	return err
}
