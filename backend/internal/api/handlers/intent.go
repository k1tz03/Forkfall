package handlers

import (
	"encoding/json"
	"net/http"
)

type IntentHandler struct{}

func NewIntentHandler() *IntentHandler {
	return &IntentHandler{}
}

type IntentOption struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description,omitempty"`
	Emoji       string `json:"emoji,omitempty"`
}

type IntentsResponse struct {
	Lanes    []IntentOption `json:"lanes"`
	Energies []IntentOption `json:"energies"`
	Moods    []IntentOption `json:"moods"`
}

func (h *IntentHandler) GetIntents(w http.ResponseWriter, r *http.Request) {
	resp := IntentsResponse{
		Lanes: []IntentOption{
			{ID: "discover", Label: "Discover", Description: "Explore new ideas and perspectives", Emoji: "🔍"},
			{ID: "debate", Label: "Debate", Description: "Engage in friendly arguments", Emoji: "⚔️"},
			{ID: "vibe", Label: "Vibe", Description: "Light-hearted fun and entertainment", Emoji: "✨"},
			{ID: "reflect", Label: "Reflect", Description: "Deep thoughts and introspection", Emoji: "🪞"},
			{ID: "decide", Label: "Decide", Description: "Help making real choices", Emoji: "🎯"},
		},
		Energies: []IntentOption{
			{ID: "chill", Label: "Chill", Description: "Relaxed, low-stakes choices", Emoji: "😌"},
			{ID: "balanced", Label: "Balanced", Description: "Mix of easy and engaging", Emoji: "⚖️"},
			{ID: "intense", Label: "Intense", Description: "High-stakes, thought-provoking", Emoji: "🔥"},
		},
		Moods: []IntentOption{
			{ID: "playful", Label: "Playful", Emoji: "😄"},
			{ID: "serious", Label: "Serious", Emoji: "🤔"},
			{ID: "spicy", Label: "Spicy", Emoji: "🌶️"},
			{ID: "wholesome", Label: "Wholesome", Emoji: "💖"},
			{ID: "chaotic", Label: "Chaotic", Emoji: "🌪️"},
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
