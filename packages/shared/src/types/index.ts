/**
 * Shared types for FORKFALL
 */

// ============ Core Entities ============

export interface Fork {
  id: string;
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  leftAssetId?: string;
  rightAssetId?: string;
  intentLane: IntentLane;
  mood?: Mood;
  energy?: Energy;
  timeFitS?: number;
  cognitiveLoad?: CognitiveLoad;
  parentForkId?: string;
  mutationType?: MutationType;
  safetyAgeGate: AgeGate;
  safetySensitivity: Sensitivity;
  safetyFlags: SafetyFlag[];
  createdByActorId: string;
  createdByMaskId?: string;
  createdAt: string;

  // Aggregated stats
  leftCount: number;
  rightCount: number;
  skipCount: number;
  twistCount: number;
}

export interface Actor {
  id: string;
  deviceFingerprint: string;
  trustScore: number;
  status: ActorStatus;
  createdAt: string;
}

export interface Mask {
  id: string;
  actorId: string;
  lane: IntentLane;
  rotatesAt?: string;
  createdAt: string;
}

export interface Interaction {
  id: string;
  actorId: string;
  forkId: string;
  type: InteractionType;
  dwellMs?: number;
  createdAt: string;
}

export interface Report {
  id: string;
  actorId: string;
  forkId: string;
  reason: ReportReason;
  state: ReportState;
  createdAt: string;
}

// ============ Intent System ============

export interface Session {
  lane: IntentLane;
  energy: Energy;
  mood?: Mood;
}

export interface IntentOption {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
}

// ============ API Types ============

export interface CreateForkInput {
  prompt: string;
  leftLabel: string;
  rightLabel: string;
  intentLane: IntentLane;
  mood?: Mood;
  energy?: Energy;
  parentForkId?: string;
  mutationType?: MutationType;
}

export interface InteractInput {
  forkId: string;
  type: InteractionType;
  dwellMs?: number;
}

export interface FeedResponse {
  forks: Fork[];
  nextCursor?: string;
}

export interface AuthResponse {
  token: string;
  actorId: string;
  isNew: boolean;
}

export interface IntentsResponse {
  lanes: IntentOption[];
  energies: IntentOption[];
  moods: IntentOption[];
}

// ============ Enums as Types ============

export type IntentLane = 'discover' | 'debate' | 'vibe' | 'reflect' | 'decide';

export type Energy = 'chill' | 'balanced' | 'intense';

export type Mood = 'playful' | 'serious' | 'spicy' | 'wholesome' | 'chaotic';

export type CognitiveLoad = 'low' | 'medium' | 'high';

export type InteractionType = 'swipe_left' | 'swipe_right' | 'skip' | 'twist';

export type MutationType = 'flip' | 'reframe' | 'escalate' | 'specific' | 'opposite';

export type ActorStatus = 'active' | 'suspended' | 'banned';

export type AgeGate = 'all' | '13+' | '17+' | '18+';

export type Sensitivity = 'normal' | 'sensitive' | 'explicit';

export type SafetyFlag =
  | 'violence'
  | 'sexual'
  | 'drugs'
  | 'politics'
  | 'religion'
  | 'controversial';

export type ReportReason =
  | 'inappropriate'
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'other';

export type ReportState = 'pending' | 'reviewed' | 'dismissed' | 'actioned';
