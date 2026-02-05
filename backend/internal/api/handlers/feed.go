package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/forkfall/backend/internal/api/middleware"
	"github.com/forkfall/backend/internal/service"
)

type FeedHandler struct {
	feedService *service.FeedService
}

func NewFeedHandler(feedService *service.FeedService) *FeedHandler {
	return &FeedHandler{
		feedService: feedService,
	}
}

type FeedResponse struct {
	Forks      []ForkResponse `json:"forks"`
	NextCursor string         `json:"next_cursor,omitempty"`
}

type ForkResponse struct {
	ID             string   `json:"id"`
	Prompt         string   `json:"prompt"`
	LeftLabel      string   `json:"left_label"`
	RightLabel     string   `json:"right_label"`
	LeftAssetURL   string   `json:"left_asset_url,omitempty"`
	RightAssetURL  string   `json:"right_asset_url,omitempty"`
	IntentLane     string   `json:"intent_lane"`
	Mood           string   `json:"mood,omitempty"`
	Energy         string   `json:"energy,omitempty"`
	ParentForkID   string   `json:"parent_fork_id,omitempty"`
	MutationType   string   `json:"mutation_type,omitempty"`
	LeftCount      int      `json:"left_count"`
	RightCount     int      `json:"right_count"`
	SkipCount      int      `json:"skip_count"`
	TwistCount     int      `json:"twist_count"`
	SafetyAgeGate  string   `json:"safety_age_gate"`
	SafetyFlags    []string `json:"safety_flags"`
	CreatedAt      string   `json:"created_at"`
}

func (h *FeedHandler) GetFeed(w http.ResponseWriter, r *http.Request) {
	actorID, ok := middleware.GetActorID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	// Parse query parameters
	lane := r.URL.Query().Get("lane")
	energy := r.URL.Query().Get("energy")
	cursor := r.URL.Query().Get("cursor")
	limitStr := r.URL.Query().Get("limit")

	limit := 20
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
			limit = l
		}
	}

	session := service.Session{
		Lane:   lane,
		Energy: energy,
	}

	forks, nextCursor, err := h.feedService.GetFeed(r.Context(), actorID, session, cursor, limit)
	if err != nil {
		http.Error(w, `{"error":"failed to get feed"}`, http.StatusInternalServerError)
		return
	}

	forkResponses := make([]ForkResponse, len(forks))
	for i, fork := range forks {
		forkResponses[i] = ForkResponse{
			ID:            fork.ID.String(),
			Prompt:        fork.Prompt,
			LeftLabel:     fork.LeftLabel,
			RightLabel:    fork.RightLabel,
			IntentLane:    fork.IntentLane,
			Mood:          fork.Mood,
			Energy:        fork.Energy,
			LeftCount:     fork.LeftCount,
			RightCount:    fork.RightCount,
			SkipCount:     fork.SkipCount,
			TwistCount:    fork.TwistCount,
			SafetyAgeGate: fork.SafetyAgeGate,
			SafetyFlags:   fork.SafetyFlags,
			CreatedAt:     fork.CreatedAt.Format("2006-01-02T15:04:05Z"),
		}
		if fork.ParentForkID != nil {
			forkResponses[i].ParentForkID = fork.ParentForkID.String()
		}
		if fork.MutationType != "" {
			forkResponses[i].MutationType = fork.MutationType
		}
	}

	resp := FeedResponse{
		Forks:      forkResponses,
		NextCursor: nextCursor,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

type UpdateSessionRequest struct {
	Lane   string `json:"lane"`
	Energy string `json:"energy"`
}

func (h *FeedHandler) UpdateSession(w http.ResponseWriter, r *http.Request) {
	actorID, ok := middleware.GetActorID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req UpdateSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	session := service.Session{
		Lane:   req.Lane,
		Energy: req.Energy,
	}

	if err := h.feedService.UpdateSession(r.Context(), actorID, session); err != nil {
		http.Error(w, `{"error":"failed to update session"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}
