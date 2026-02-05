package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/forkfall/backend/internal/service"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

type DeviceAuthRequest struct {
	DeviceFingerprint string `json:"device_fingerprint"`
}

type DeviceAuthResponse struct {
	Token   string `json:"token"`
	ActorID string `json:"actor_id"`
	IsNew   bool   `json:"is_new"`
}

func (h *AuthHandler) DeviceAuth(w http.ResponseWriter, r *http.Request) {
	var req DeviceAuthRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.DeviceFingerprint == "" {
		http.Error(w, `{"error":"device_fingerprint is required"}`, http.StatusBadRequest)
		return
	}

	result, err := h.authService.AuthenticateDevice(r.Context(), req.DeviceFingerprint)
	if err != nil {
		http.Error(w, `{"error":"authentication failed"}`, http.StatusInternalServerError)
		return
	}

	resp := DeviceAuthResponse{
		Token:   result.Token,
		ActorID: result.ActorID.String(),
		IsNew:   result.IsNew,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
