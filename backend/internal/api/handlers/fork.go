package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/forkfall/backend/internal/api/middleware"
	"github.com/forkfall/backend/internal/domain"
	"github.com/forkfall/backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type ForkHandler struct {
	forkService *service.ForkService
}

func NewForkHandler(forkService *service.ForkService) *ForkHandler {
	return &ForkHandler{
		forkService: forkService,
	}
}

type CreateForkRequest struct {
	Prompt       string  `json:"prompt"`
	LeftLabel    string  `json:"left_label"`
	RightLabel   string  `json:"right_label"`
	IntentLane   string  `json:"intent_lane"`
	Mood         string  `json:"mood,omitempty"`
	Energy       string  `json:"energy,omitempty"`
	ParentForkID *string `json:"parent_fork_id,omitempty"`
	MutationType string  `json:"mutation_type,omitempty"`
}

func (h *ForkHandler) CreateFork(w http.ResponseWriter, r *http.Request) {
	actorID, ok := middleware.GetActorID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req CreateForkRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Prompt == "" || req.LeftLabel == "" || req.RightLabel == "" || req.IntentLane == "" {
		http.Error(w, `{"error":"prompt, left_label, right_label, and intent_lane are required"}`, http.StatusBadRequest)
		return
	}

	// Validate lengths
	if len(req.Prompt) > 90 {
		http.Error(w, `{"error":"prompt must be 90 characters or less"}`, http.StatusBadRequest)
		return
	}
	if len(req.LeftLabel) > 24 || len(req.RightLabel) > 24 {
		http.Error(w, `{"error":"labels must be 24 characters or less"}`, http.StatusBadRequest)
		return
	}

	input := domain.CreateForkInput{
		Prompt:       req.Prompt,
		LeftLabel:    req.LeftLabel,
		RightLabel:   req.RightLabel,
		IntentLane:   req.IntentLane,
		Mood:         req.Mood,
		Energy:       req.Energy,
		MutationType: req.MutationType,
	}

	if req.ParentForkID != nil {
		parentID, err := uuid.Parse(*req.ParentForkID)
		if err != nil {
			http.Error(w, `{"error":"invalid parent_fork_id format"}`, http.StatusBadRequest)
			return
		}
		input.ParentForkID = &parentID
	}

	fork, err := h.forkService.CreateFork(r.Context(), actorID, input)
	if err != nil {
		http.Error(w, `{"error":"failed to create fork"}`, http.StatusInternalServerError)
		return
	}

	resp := ForkResponse{
		ID:            fork.ID.String(),
		Prompt:        fork.Prompt,
		LeftLabel:     fork.LeftLabel,
		RightLabel:    fork.RightLabel,
		IntentLane:    fork.IntentLane,
		Mood:          fork.Mood,
		Energy:        fork.Energy,
		SafetyAgeGate: fork.SafetyAgeGate,
		SafetyFlags:   fork.SafetyFlags,
		CreatedAt:     fork.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	if fork.ParentForkID != nil {
		resp.ParentForkID = fork.ParentForkID.String()
	}
	if fork.MutationType != "" {
		resp.MutationType = fork.MutationType
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func (h *ForkHandler) GetFork(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, `{"error":"invalid fork id"}`, http.StatusBadRequest)
		return
	}

	fork, err := h.forkService.GetFork(r.Context(), id)
	if err != nil {
		http.Error(w, `{"error":"fork not found"}`, http.StatusNotFound)
		return
	}

	resp := ForkResponse{
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
		resp.ParentForkID = fork.ParentForkID.String()
	}
	if fork.MutationType != "" {
		resp.MutationType = fork.MutationType
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

type InteractRequest struct {
	Type    string `json:"type"` // swipe_left, swipe_right, skip, twist
	DwellMs int    `json:"dwell_ms,omitempty"`
}

func (h *ForkHandler) Interact(w http.ResponseWriter, r *http.Request) {
	actorID, ok := middleware.GetActorID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	idStr := chi.URLParam(r, "id")
	forkID, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, `{"error":"invalid fork id"}`, http.StatusBadRequest)
		return
	}

	var req InteractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	validTypes := map[string]bool{
		"swipe_left":  true,
		"swipe_right": true,
		"skip":        true,
		"twist":       true,
	}
	if !validTypes[req.Type] {
		http.Error(w, `{"error":"invalid interaction type"}`, http.StatusBadRequest)
		return
	}

	input := domain.InteractionInput{
		ForkID:  forkID,
		Type:    req.Type,
		DwellMs: req.DwellMs,
	}

	if err := h.forkService.RecordInteraction(r.Context(), actorID, input); err != nil {
		http.Error(w, `{"error":"failed to record interaction"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}

type ReportRequest struct {
	Reason string `json:"reason"`
}

func (h *ForkHandler) Report(w http.ResponseWriter, r *http.Request) {
	actorID, ok := middleware.GetActorID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	idStr := chi.URLParam(r, "id")
	forkID, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, `{"error":"invalid fork id"}`, http.StatusBadRequest)
		return
	}

	var req ReportRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	validReasons := map[string]bool{
		"inappropriate": true,
		"spam":          true,
		"harassment":    true,
		"hate_speech":   true,
		"other":         true,
	}
	if !validReasons[req.Reason] {
		http.Error(w, `{"error":"invalid report reason"}`, http.StatusBadRequest)
		return
	}

	if err := h.forkService.ReportFork(r.Context(), actorID, forkID, req.Reason); err != nil {
		http.Error(w, `{"error":"failed to submit report"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}
