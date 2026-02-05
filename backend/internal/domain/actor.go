package domain

import (
	"time"

	"github.com/google/uuid"
)

// Actor represents a user in the system (device-based identity)
type Actor struct {
	ID                uuid.UUID
	DeviceFingerprint string
	TrustScore        float64
	Status            string
	CreatedAt         time.Time
}

// Actor statuses
const (
	ActorStatusActive    = "active"
	ActorStatusSuspended = "suspended"
	ActorStatusBanned    = "banned"
)

// Mask represents a persona used by an actor in a specific lane
type Mask struct {
	ID        uuid.UUID
	ActorID   uuid.UUID
	Lane      string
	RotatesAt *time.Time
	CreatedAt time.Time
}

// NewActor creates a new actor with default values
func NewActor(deviceFingerprint string) *Actor {
	return &Actor{
		ID:                uuid.New(),
		DeviceFingerprint: deviceFingerprint,
		TrustScore:        1.0,
		Status:            ActorStatusActive,
		CreatedAt:         time.Now(),
	}
}

// IsActive checks if the actor is active
func (a *Actor) IsActive() bool {
	return a.Status == ActorStatusActive
}

// CanCreate checks if the actor can create content
func (a *Actor) CanCreate() bool {
	return a.IsActive() && a.TrustScore >= 0.5
}
