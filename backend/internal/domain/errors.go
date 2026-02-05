package domain

import "errors"

var (
	ErrNotFound        = errors.New("not found")
	ErrPromptTooLong   = errors.New("prompt must be 90 characters or less")
	ErrLabelTooLong    = errors.New("label must be 24 characters or less")
	ErrMissingRequired = errors.New("missing required fields")
	ErrInvalidInput    = errors.New("invalid input")
	ErrUnauthorized    = errors.New("unauthorized")
	ErrRateLimited     = errors.New("rate limited")
)
