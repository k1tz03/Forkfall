export interface Fork {
  id: string;
  prompt: string;
  left_label: string;
  right_label: string;
  left_asset_url?: string;
  right_asset_url?: string;
  intent_lane: string;
  mood?: string;
  energy?: string;
  parent_fork_id?: string;
  mutation_type?: string;
  left_count: number;
  right_count: number;
  skip_count: number;
  twist_count: number;
  safety_age_gate: string;
  safety_flags: string[];
  created_at: string;
}

export interface FeedResponse {
  forks: Fork[];
  next_cursor?: string;
}

export interface IntentOption {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
}

export interface IntentsResponse {
  lanes: IntentOption[];
  energies: IntentOption[];
  moods: IntentOption[];
}

export interface AuthResponse {
  token: string;
  actor_id: string;
  is_new: boolean;
}

export interface Session {
  lane: string;
  energy: string;
}

export type InteractionType = 'swipe_left' | 'swipe_right' | 'skip' | 'twist';

export interface CreateForkInput {
  prompt: string;
  left_label: string;
  right_label: string;
  intent_lane: string;
  mood?: string;
  energy?: string;
  parent_fork_id?: string;
  mutation_type?: string;
}
