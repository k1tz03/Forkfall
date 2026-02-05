/**
 * Shared constants for FORKFALL
 */

// ============ Content Limits ============

export const LIMITS = {
  PROMPT_MAX_LENGTH: 90,
  LABEL_MAX_LENGTH: 24,
  CREATES_PER_HOUR: 10,
  SWIPES_PER_MINUTE: 100,
  FEED_PAGE_SIZE: 20,
  MAX_FEED_PAGE_SIZE: 50,
} as const;

// ============ Intent Options ============

export const LANES = [
  { id: 'discover', label: 'Discover', description: 'Explore new ideas and perspectives', emoji: '🔍' },
  { id: 'debate', label: 'Debate', description: 'Engage in friendly arguments', emoji: '⚔️' },
  { id: 'vibe', label: 'Vibe', description: 'Light-hearted fun and entertainment', emoji: '✨' },
  { id: 'reflect', label: 'Reflect', description: 'Deep thoughts and introspection', emoji: '🪞' },
  { id: 'decide', label: 'Decide', description: 'Help making real choices', emoji: '🎯' },
] as const;

export const ENERGIES = [
  { id: 'chill', label: 'Chill', description: 'Relaxed, low-stakes choices', emoji: '😌' },
  { id: 'balanced', label: 'Balanced', description: 'Mix of easy and engaging', emoji: '⚖️' },
  { id: 'intense', label: 'Intense', description: 'High-stakes, thought-provoking', emoji: '🔥' },
] as const;

export const MOODS = [
  { id: 'playful', label: 'Playful', emoji: '😄' },
  { id: 'serious', label: 'Serious', emoji: '🤔' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { id: 'wholesome', label: 'Wholesome', emoji: '💖' },
  { id: 'chaotic', label: 'Chaotic', emoji: '🌪️' },
] as const;

// ============ Mutation Types ============

export const MUTATION_TYPES = [
  { id: 'flip', label: 'Flip', description: 'Swap left/right labels', emoji: '🔄' },
  { id: 'reframe', label: 'Reframe', description: 'Change prompt, keep labels', emoji: '🎭' },
  { id: 'escalate', label: 'Escalate', description: 'Make it more extreme', emoji: '🔥' },
  { id: 'specific', label: 'Narrow', description: 'Make it more specific', emoji: '🎯' },
  { id: 'opposite', label: 'Opposite', description: 'Create opposite scenario', emoji: '🔁' },
] as const;

// ============ Report Reasons ============

export const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate content' },
  { id: 'spam', label: 'Spam or misleading' },
  { id: 'harassment', label: 'Harassment or bullying' },
  { id: 'hate_speech', label: 'Hate speech' },
  { id: 'other', label: 'Other' },
] as const;

// ============ Ranking Weights ============

export const RANKING_WEIGHTS = {
  LANE_MATCH: 40,
  ENERGY_MATCH: 20,
  FRESHNESS_MAX: 15,
  FRESHNESS_DECAY_HOURS: 24,
  SKIP_PENALTY: 10,
  ENGAGEMENT_BONUS: 5,
  DIVERSITY_BONUS: 10,
  TWIST_BONUS_PER: 5,
  TWIST_BONUS_MAX: 25,
  REPORT_PENALTY: 20,
} as const;

// ============ Feed Diversity ============

export const DIVERSITY = {
  CHECK_INTERVAL: 20, // Every N forks
  MIN_TEMPLATES: 3,
  MIN_LANES: 2,
  EXPLORATION_QUOTA: 0.2, // 20% random high-quality
} as const;

// ============ Safety Thresholds ============

export const SAFETY = {
  AUTO_HIDE_REPORT_COUNT: 3,
  TRUST_SCORE_CREATE_MIN: 0.5,
  TRUST_SCORE_DEFAULT: 1.0,
} as const;

// ============ Timing ============

export const TIMING = {
  JWT_EXPIRY_DAYS: 30,
  MASK_ROTATION_HOURS: 24,
  SESSION_EXPIRY_HOURS: 24,
} as const;
