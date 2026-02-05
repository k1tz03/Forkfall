package postgres

import (
	"context"
	"time"

	"github.com/forkfall/backend/internal/domain"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type ForkRepository struct {
	db *pgxpool.Pool
}

func NewForkRepository(db *pgxpool.Pool) *ForkRepository {
	return &ForkRepository{db: db}
}

func (r *ForkRepository) Create(ctx context.Context, fork *domain.Fork) error {
	query := `
		INSERT INTO forks (
			id, prompt, left_label, right_label, left_asset_id, right_asset_id,
			intent_lane, mood, energy, time_fit_s, cognitive_load,
			parent_fork_id, mutation_type, safety_age_gate, safety_sensitivity,
			safety_flags, created_by_actor_id, created_by_mask_id, created_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
		)
	`
	_, err := r.db.Exec(ctx, query,
		fork.ID,
		fork.Prompt,
		fork.LeftLabel,
		fork.RightLabel,
		fork.LeftAssetID,
		fork.RightAssetID,
		fork.IntentLane,
		fork.Mood,
		fork.Energy,
		fork.TimeFitS,
		fork.CognitiveLoad,
		fork.ParentForkID,
		fork.MutationType,
		fork.SafetyAgeGate,
		fork.SafetySensitivity,
		fork.SafetyFlags,
		fork.CreatedByActorID,
		fork.CreatedByMaskID,
		fork.CreatedAt,
	)
	return err
}

func (r *ForkRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Fork, error) {
	query := `
		SELECT
			f.id, f.prompt, f.left_label, f.right_label, f.left_asset_id, f.right_asset_id,
			f.intent_lane, f.mood, f.energy, f.time_fit_s, f.cognitive_load,
			f.parent_fork_id, f.mutation_type, f.safety_age_gate, f.safety_sensitivity,
			f.safety_flags, f.created_by_actor_id, f.created_by_mask_id, f.created_at,
			COALESCE(stats.left_count, 0) as left_count,
			COALESCE(stats.right_count, 0) as right_count,
			COALESCE(stats.skip_count, 0) as skip_count,
			COALESCE(stats.twist_count, 0) as twist_count
		FROM forks f
		LEFT JOIN (
			SELECT
				fork_id,
				COUNT(*) FILTER (WHERE interaction_type = 'swipe_left') as left_count,
				COUNT(*) FILTER (WHERE interaction_type = 'swipe_right') as right_count,
				COUNT(*) FILTER (WHERE interaction_type = 'skip') as skip_count,
				COUNT(*) FILTER (WHERE interaction_type = 'twist') as twist_count
			FROM interactions
			GROUP BY fork_id
		) stats ON f.id = stats.fork_id
		WHERE f.id = $1
	`
	var fork domain.Fork
	var leftAssetID, rightAssetID, parentForkID, createdByMaskID *uuid.UUID
	var mood, energy, cognitiveLoad, mutationType *string
	var timeFitS *int

	err := r.db.QueryRow(ctx, query, id).Scan(
		&fork.ID,
		&fork.Prompt,
		&fork.LeftLabel,
		&fork.RightLabel,
		&leftAssetID,
		&rightAssetID,
		&fork.IntentLane,
		&mood,
		&energy,
		&timeFitS,
		&cognitiveLoad,
		&parentForkID,
		&mutationType,
		&fork.SafetyAgeGate,
		&fork.SafetySensitivity,
		&fork.SafetyFlags,
		&fork.CreatedByActorID,
		&createdByMaskID,
		&fork.CreatedAt,
		&fork.LeftCount,
		&fork.RightCount,
		&fork.SkipCount,
		&fork.TwistCount,
	)
	if err != nil {
		return nil, err
	}

	fork.LeftAssetID = leftAssetID
	fork.RightAssetID = rightAssetID
	fork.ParentForkID = parentForkID
	fork.CreatedByMaskID = createdByMaskID
	if mood != nil {
		fork.Mood = *mood
	}
	if energy != nil {
		fork.Energy = *energy
	}
	if cognitiveLoad != nil {
		fork.CognitiveLoad = *cognitiveLoad
	}
	if mutationType != nil {
		fork.MutationType = *mutationType
	}
	if timeFitS != nil {
		fork.TimeFitS = *timeFitS
	}

	return &fork, nil
}

func (r *ForkRepository) GetFeed(ctx context.Context, lane, energy string, excludeIDs []uuid.UUID, limit int, offset int) ([]*domain.Fork, error) {
	query := `
		SELECT
			f.id, f.prompt, f.left_label, f.right_label, f.left_asset_id, f.right_asset_id,
			f.intent_lane, f.mood, f.energy, f.time_fit_s, f.cognitive_load,
			f.parent_fork_id, f.mutation_type, f.safety_age_gate, f.safety_sensitivity,
			f.safety_flags, f.created_by_actor_id, f.created_by_mask_id, f.created_at,
			COALESCE(stats.left_count, 0) as left_count,
			COALESCE(stats.right_count, 0) as right_count,
			COALESCE(stats.skip_count, 0) as skip_count,
			COALESCE(stats.twist_count, 0) as twist_count
		FROM forks f
		LEFT JOIN (
			SELECT
				fork_id,
				COUNT(*) FILTER (WHERE interaction_type = 'swipe_left') as left_count,
				COUNT(*) FILTER (WHERE interaction_type = 'swipe_right') as right_count,
				COUNT(*) FILTER (WHERE interaction_type = 'skip') as skip_count,
				COUNT(*) FILTER (WHERE interaction_type = 'twist') as twist_count
			FROM interactions
			GROUP BY fork_id
		) stats ON f.id = stats.fork_id
		WHERE ($1 = '' OR f.intent_lane = $1)
		  AND ($2 = '' OR f.energy = $2)
		  AND (cardinality($3::uuid[]) = 0 OR f.id != ALL($3::uuid[]))
		ORDER BY f.created_at DESC
		LIMIT $4 OFFSET $5
	`

	rows, err := r.db.Query(ctx, query, lane, energy, excludeIDs, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var forks []*domain.Fork
	for rows.Next() {
		var fork domain.Fork
		var leftAssetID, rightAssetID, parentForkID, createdByMaskID *uuid.UUID
		var mood, energy, cognitiveLoad, mutationType *string
		var timeFitS *int

		err := rows.Scan(
			&fork.ID,
			&fork.Prompt,
			&fork.LeftLabel,
			&fork.RightLabel,
			&leftAssetID,
			&rightAssetID,
			&fork.IntentLane,
			&mood,
			&energy,
			&timeFitS,
			&cognitiveLoad,
			&parentForkID,
			&mutationType,
			&fork.SafetyAgeGate,
			&fork.SafetySensitivity,
			&fork.SafetyFlags,
			&fork.CreatedByActorID,
			&createdByMaskID,
			&fork.CreatedAt,
			&fork.LeftCount,
			&fork.RightCount,
			&fork.SkipCount,
			&fork.TwistCount,
		)
		if err != nil {
			return nil, err
		}

		fork.LeftAssetID = leftAssetID
		fork.RightAssetID = rightAssetID
		fork.ParentForkID = parentForkID
		fork.CreatedByMaskID = createdByMaskID
		if mood != nil {
			fork.Mood = *mood
		}
		if energy != nil {
			fork.Energy = *energy
		}
		if cognitiveLoad != nil {
			fork.CognitiveLoad = *cognitiveLoad
		}
		if mutationType != nil {
			fork.MutationType = *mutationType
		}
		if timeFitS != nil {
			fork.TimeFitS = *timeFitS
		}

		forks = append(forks, &fork)
	}

	return forks, nil
}

func (r *ForkRepository) GetByParent(ctx context.Context, parentID uuid.UUID) ([]*domain.Fork, error) {
	query := `
		SELECT
			id, prompt, left_label, right_label, intent_lane, mood, energy,
			mutation_type, created_at
		FROM forks
		WHERE parent_fork_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, parentID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var forks []*domain.Fork
	for rows.Next() {
		var fork domain.Fork
		var mood, energy, mutationType *string
		err := rows.Scan(
			&fork.ID,
			&fork.Prompt,
			&fork.LeftLabel,
			&fork.RightLabel,
			&fork.IntentLane,
			&mood,
			&energy,
			&mutationType,
			&fork.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		if mood != nil {
			fork.Mood = *mood
		}
		if energy != nil {
			fork.Energy = *energy
		}
		if mutationType != nil {
			fork.MutationType = *mutationType
		}
		forks = append(forks, &fork)
	}

	return forks, nil
}

func (r *ForkRepository) GetReportCount(ctx context.Context, forkID uuid.UUID, since time.Time) (int, error) {
	query := `
		SELECT COUNT(*)
		FROM reports
		WHERE fork_id = $1 AND created_at >= $2 AND state = 'pending'
	`
	var count int
	err := r.db.QueryRow(ctx, query, forkID, since).Scan(&count)
	return count, err
}

func (r *ForkRepository) CreateReport(ctx context.Context, report *domain.Report) error {
	query := `
		INSERT INTO reports (id, actor_id, fork_id, reason, state, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.Exec(ctx, query,
		report.ID,
		report.ActorID,
		report.ForkID,
		report.Reason,
		report.State,
		report.CreatedAt,
	)
	return err
}
