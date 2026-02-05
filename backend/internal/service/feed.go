package service

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"math"
	"sort"
	"time"

	"github.com/forkfall/backend/internal/domain"
	"github.com/forkfall/backend/internal/repository/postgres"
	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type FeedService struct {
	forkRepo        *postgres.ForkRepository
	interactionRepo *postgres.InteractionRepository
	redis           *redis.Client
}

func NewFeedService(
	forkRepo *postgres.ForkRepository,
	interactionRepo *postgres.InteractionRepository,
	redis *redis.Client,
) *FeedService {
	return &FeedService{
		forkRepo:        forkRepo,
		interactionRepo: interactionRepo,
		redis:           redis,
	}
}

type Session struct {
	Lane   string
	Energy string
}

type feedCursor struct {
	Offset int `json:"o"`
}

func (s *FeedService) GetFeed(ctx context.Context, actorID uuid.UUID, session Session, cursor string, limit int) ([]*domain.Fork, string, error) {
	// Parse cursor
	offset := 0
	if cursor != "" {
		data, err := base64.StdEncoding.DecodeString(cursor)
		if err == nil {
			var c feedCursor
			json.Unmarshal(data, &c)
			offset = c.Offset
		}
	}

	// Get seen fork IDs (last 24 hours)
	seenIDs, err := s.interactionRepo.GetSeenForkIDs(ctx, actorID, time.Now().Add(-24*time.Hour))
	if err != nil {
		seenIDs = []uuid.UUID{}
	}

	// Fetch more forks than needed for ranking
	fetchLimit := limit * 3
	forks, err := s.forkRepo.GetFeed(ctx, session.Lane, session.Energy, seenIDs, fetchLimit, offset)
	if err != nil {
		return nil, "", err
	}

	// Get actor's recent interactions for diversity
	interactions, err := s.interactionRepo.GetByActor(ctx, actorID, 100)
	if err != nil {
		interactions = []*domain.Interaction{}
	}

	// Score and rank forks
	scoredForks := s.rankForks(forks, session, interactions)

	// Apply limit
	if len(scoredForks) > limit {
		scoredForks = scoredForks[:limit]
	}

	// Generate next cursor
	var nextCursor string
	if len(forks) == fetchLimit {
		c := feedCursor{Offset: offset + limit}
		data, _ := json.Marshal(c)
		nextCursor = base64.StdEncoding.EncodeToString(data)
	}

	return scoredForks, nextCursor, nil
}

type scoredFork struct {
	fork  *domain.Fork
	score float64
}

func (s *FeedService) rankForks(forks []*domain.Fork, session Session, history []*domain.Interaction) []*domain.Fork {
	scored := make([]scoredFork, len(forks))

	// Build seen templates set
	seenLanes := make(map[string]int)
	for _, i := range history {
		// Count recent interactions by lane (from fork)
		seenLanes[i.Type]++
	}

	for i, fork := range forks {
		score := s.scoreFork(fork, session, seenLanes)
		scored[i] = scoredFork{fork: fork, score: score}
	}

	// Sort by score descending
	sort.Slice(scored, func(i, j int) bool {
		return scored[i].score > scored[j].score
	})

	result := make([]*domain.Fork, len(scored))
	for i, sf := range scored {
		result[i] = sf.fork
	}

	return result
}

func (s *FeedService) scoreFork(fork *domain.Fork, session Session, seenLanes map[string]int) float64 {
	score := 0.0

	// Intent match (highest weight)
	if fork.IntentLane == session.Lane {
		score += 40
	}
	if fork.Energy == session.Energy {
		score += 20
	}

	// Freshness (decay over 24h)
	age := time.Since(fork.CreatedAt)
	score += 15 * math.Max(0, 1-age.Hours()/24)

	// Skip penalty
	total := float64(fork.LeftCount + fork.RightCount + fork.SkipCount)
	if total > 0 {
		skipRate := float64(fork.SkipCount) / total
		score -= 10 * skipRate
	}

	// Engagement bonus
	if total > 10 {
		engagementRate := float64(fork.LeftCount+fork.RightCount) / total
		score += 5 * engagementRate
	}

	// Diversity bonus (different lanes)
	if seenLanes[fork.IntentLane] < 5 {
		score += 10
	}

	// Twist popularity bonus
	if fork.TwistCount > 0 {
		score += 5 * math.Min(float64(fork.TwistCount), 5)
	}

	return score
}

func (s *FeedService) UpdateSession(ctx context.Context, actorID uuid.UUID, session Session) error {
	// Store session in Redis
	key := "session:" + actorID.String()
	data, _ := json.Marshal(session)
	return s.redis.Set(ctx, key, data, 24*time.Hour).Err()
}

func (s *FeedService) GetSession(ctx context.Context, actorID uuid.UUID) (*Session, error) {
	key := "session:" + actorID.String()
	data, err := s.redis.Get(ctx, key).Bytes()
	if err != nil {
		if err == redis.Nil {
			return &Session{}, nil
		}
		return nil, err
	}

	var session Session
	if err := json.Unmarshal(data, &session); err != nil {
		return nil, err
	}
	return &session, nil
}
