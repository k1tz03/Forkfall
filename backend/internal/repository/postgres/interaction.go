package postgres

import (
	"context"
	"time"

	"github.com/forkfall/backend/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type InteractionRepository struct {
	db *pgxpool.Pool
}

func NewInteractionRepository(db *pgxpool.Pool) *InteractionRepository {
	return &InteractionRepository{db: db}
}

func (r *InteractionRepository) Create(ctx context.Context, interaction *domain.Interaction) error {
	query := `
		INSERT INTO interactions (id, actor_id, fork_id, interaction_type, dwell_ms, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query,
		interaction.ID,
		interaction.ActorID,
		interaction.ForkID,
		interaction.Type,
		interaction.DwellMs,
		interaction.CreatedAt,
	)
	return err
}

func (r *InteractionRepository) GetByActor(ctx context.Context, actorID uuid.UUID, limit int) ([]*domain.Interaction, error) {
	query := `
		SELECT id, actor_id, fork_id, interaction_type, dwell_ms, created_at
		FROM interactions
		WHERE actor_id = $1
		ORDER BY created_at DESC
		LIMIT $2
	`
	rows, err := r.db.Query(ctx, query, actorID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var interactions []*domain.Interaction
	for rows.Next() {
		var i domain.Interaction
		var dwellMs *int
		err := rows.Scan(&i.ID, &i.ActorID, &i.ForkID, &i.Type, &dwellMs, &i.CreatedAt)
		if err != nil {
			return nil, err
		}
		if dwellMs != nil {
			i.DwellMs = *dwellMs
		}
		interactions = append(interactions, &i)
	}

	return interactions, nil
}

func (r *InteractionRepository) GetSeenForkIDs(ctx context.Context, actorID uuid.UUID, since time.Time) ([]uuid.UUID, error) {
	query := `
		SELECT DISTINCT fork_id
		FROM interactions
		WHERE actor_id = $1 AND created_at >= $2
	`
	rows, err := r.db.Query(ctx, query, actorID, since)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []uuid.UUID
	for rows.Next() {
		var id uuid.UUID
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}

	return ids, nil
}

func (r *InteractionRepository) CountByActorSince(ctx context.Context, actorID uuid.UUID, interactionType string, since time.Time) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM interactions
		WHERE actor_id = $1 AND interaction_type = $2 AND created_at >= $3
	`
	var count int
	err := r.db.QueryRow(ctx, query, actorID, interactionType, since).Scan(&count)
	return count, err
}

func (r *InteractionRepository) GetForkStats(ctx context.Context, forkID uuid.UUID) (left, right, skip, twist int, err error) {
	query := `
		SELECT
			COUNT(*) FILTER (WHERE interaction_type = 'swipe_left') as left_count,
			COUNT(*) FILTER (WHERE interaction_type = 'swipe_right') as right_count,
			COUNT(*) FILTER (WHERE interaction_type = 'skip') as skip_count,
			COUNT(*) FILTER (WHERE interaction_type = 'twist') as twist_count
		FROM interactions
		WHERE fork_id = $1
	`
	err = r.db.QueryRow(ctx, query, forkID).Scan(&left, &right, &skip, &twist)
	return
}
