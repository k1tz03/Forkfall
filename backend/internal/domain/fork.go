package domain

import (
	"time"

	"github.com/google/uuid"
)

// Fork represents a binary choice prompt
type Fork struct {
	ID               uuid.UUID
	Prompt           string
	LeftLabel        string
	RightLabel       string
	LeftAssetID      *uuid.UUID
	RightAssetID     *uuid.UUID
	IntentLane       string
	Mood             string
	Energy           string
	TimeFitS         int
	CognitiveLoad    string
	ParentForkID     *uuid.UUID
	MutationType     string
	SafetyAgeGate    string
	SafetySensitivity string
	SafetyFlags      []string
	CreatedByActorID uuid.UUID
	CreatedByMaskID  *uuid.UUID
	CreatedAt        time.Time

	// Aggregated stats (computed)
	LeftCount  int
	RightCount int
	SkipCount  int
	TwistCount int
	SkipRate   float64
	ReportRate float64
}

// CreateForkInput represents the input for creating a new fork
type CreateForkInput struct {
	Prompt       string
	LeftLabel    string
	RightLabel   string
	IntentLane   string
	Mood         string
	Energy       string
	ParentForkID *uuid.UUID
	MutationType string
}

// Validate validates the fork input
func (f *CreateForkInput) Validate() error {
	if len(f.Prompt) > 90 {
		return ErrPromptTooLong
	}
	if len(f.LeftLabel) > 24 {
		return ErrLabelTooLong
	}
	if len(f.RightLabel) > 24 {
		return ErrLabelTooLong
	}
	if f.Prompt == "" || f.LeftLabel == "" || f.RightLabel == "" {
		return ErrMissingRequired
	}
	return nil
}

// Interaction represents a user's interaction with a fork
type Interaction struct {
	ID        uuid.UUID
	ActorID   uuid.UUID
	ForkID    uuid.UUID
	Type      string
	DwellMs   int
	CreatedAt time.Time
}

// InteractionInput represents the input for recording an interaction
type InteractionInput struct {
	ForkID  uuid.UUID
	Type    string
	DwellMs int
}

// Valid interaction types
const (
	InteractionSwipeLeft  = "swipe_left"
	InteractionSwipeRight = "swipe_right"
	InteractionSkip       = "skip"
	InteractionTwist      = "twist"
)

// ValidInteractionType checks if the interaction type is valid
func ValidInteractionType(t string) bool {
	switch t {
	case InteractionSwipeLeft, InteractionSwipeRight, InteractionSkip, InteractionTwist:
		return true
	default:
		return false
	}
}

// Report represents a content report
type Report struct {
	ID        uuid.UUID
	ActorID   uuid.UUID
	ForkID    uuid.UUID
	Reason    string
	State     string
	CreatedAt time.Time
}

// Report states
const (
	ReportStatePending  = "pending"
	ReportStateReviewed = "reviewed"
	ReportStateDismissed = "dismissed"
	ReportStateActioned = "actioned"
)

// Valid report reasons
const (
	ReportReasonInappropriate = "inappropriate"
	ReportReasonSpam          = "spam"
	ReportReasonHarassment    = "harassment"
	ReportReasonHateSpeech    = "hate_speech"
	ReportReasonOther         = "other"
)

// Mutation types
const (
	MutationFlip      = "flip"       // Swap left/right labels
	MutationReframe   = "reframe"    // Change prompt, keep labels
	MutationEscalate  = "escalate"   // Make it more extreme
	MutationSpecific  = "specific"   // Make it more specific
	MutationOpposite  = "opposite"   // Create opposite scenario
)
