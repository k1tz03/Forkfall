import { Platform } from 'react-native';
import * as Device from 'expo-device';
import {
  Fork,
  FeedResponse,
  IntentsResponse,
  AuthResponse,
  InteractionType,
  CreateForkInput,
} from '../types';

// Demo mode - use mock data instead of real API
const DEMO_MODE = true;

// Determine API URL based on environment
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:8080/api/v1';
  }
  if (Platform.OS === 'web') {
    return '/api/v1';
  }
  return 'https://api.forkfall.com/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Mock data for demo
const MOCK_FORKS: Fork[] = [
  {
    id: '1',
    prompt: 'Would you rather have the power to fly or be invisible?',
    left_label: 'Fly',
    right_label: 'Invisible',
    intent_lane: 'vibe',
    mood: 'playful',
    energy: 'chill',
    left_count: 1234,
    right_count: 987,
    skip_count: 45,
    twist_count: 12,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    prompt: 'Pineapple on pizza?',
    left_label: 'Yes please',
    right_label: 'Never',
    intent_lane: 'debate',
    mood: 'spicy',
    energy: 'chill',
    left_count: 2341,
    right_count: 3456,
    skip_count: 123,
    twist_count: 34,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    prompt: 'Morning person or night owl?',
    left_label: 'Early bird',
    right_label: 'Night owl',
    intent_lane: 'discover',
    mood: 'playful',
    energy: 'chill',
    left_count: 876,
    right_count: 1543,
    skip_count: 67,
    twist_count: 8,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    prompt: 'Would you rather know how you die or when you die?',
    left_label: 'How',
    right_label: 'When',
    intent_lane: 'reflect',
    mood: 'serious',
    energy: 'intense',
    left_count: 654,
    right_count: 789,
    skip_count: 234,
    twist_count: 45,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    prompt: 'Cats or dogs?',
    left_label: 'Cats',
    right_label: 'Dogs',
    intent_lane: 'vibe',
    mood: 'wholesome',
    energy: 'chill',
    left_count: 4567,
    right_count: 5678,
    skip_count: 89,
    twist_count: 23,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    prompt: 'If you could only eat one cuisine forever?',
    left_label: 'Italian',
    right_label: 'Japanese',
    intent_lane: 'decide',
    mood: 'playful',
    energy: 'balanced',
    left_count: 1234,
    right_count: 1456,
    skip_count: 56,
    twist_count: 18,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    prompt: 'Would you rather have unlimited money or true love?',
    left_label: 'Money',
    right_label: 'Love',
    intent_lane: 'reflect',
    mood: 'serious',
    energy: 'intense',
    left_count: 2345,
    right_count: 3456,
    skip_count: 123,
    twist_count: 67,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    prompt: 'Beach vacation or mountain retreat?',
    left_label: 'Beach',
    right_label: 'Mountains',
    intent_lane: 'decide',
    mood: 'playful',
    energy: 'chill',
    left_count: 1876,
    right_count: 1654,
    skip_count: 45,
    twist_count: 12,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    prompt: 'Coffee or tea?',
    left_label: 'Coffee',
    right_label: 'Tea',
    intent_lane: 'vibe',
    mood: 'playful',
    energy: 'chill',
    left_count: 6789,
    right_count: 4321,
    skip_count: 234,
    twist_count: 45,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    prompt: 'Work from home forever or office forever?',
    left_label: 'Home',
    right_label: 'Office',
    intent_lane: 'decide',
    mood: 'serious',
    energy: 'balanced',
    left_count: 3456,
    right_count: 1234,
    skip_count: 89,
    twist_count: 23,
    safety_age_gate: 'all',
    safety_flags: [],
    created_at: new Date().toISOString(),
  },
];

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async authenticateDevice(): Promise<AuthResponse> {
    if (DEMO_MODE) {
      return {
        token: 'demo-token-' + Date.now(),
        actor_id: 'demo-actor-' + Date.now(),
        is_new: true,
      };
    }

    const fingerprint = await this.getDeviceFingerprint();
    return this.request<AuthResponse>('/auth/device', {
      method: 'POST',
      body: JSON.stringify({ device_fingerprint: fingerprint }),
    });
  }

  private async getDeviceFingerprint(): Promise<string> {
    if (Platform.OS === 'web') {
      const nav = typeof navigator !== 'undefined' ? navigator : null;
      const base = `web-${nav?.userAgent || 'unknown'}-${Date.now()}`;
      return btoa(base).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
    }

    const brand = Device.brand || 'unknown';
    const model = Device.modelName || 'unknown';
    const osName = Device.osName || 'unknown';
    const osVersion = Device.osVersion || 'unknown';

    const base = `${brand}-${model}-${osName}-${osVersion}`;
    return btoa(base).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  }

  // Feed
  async getFeed(
    lane?: string,
    energy?: string,
    cursor?: string,
    limit = 20
  ): Promise<FeedResponse> {
    if (DEMO_MODE) {
      let forks = [...MOCK_FORKS];
      if (lane) {
        forks = forks.filter((f) => f.intent_lane === lane);
      }
      if (energy) {
        forks = forks.filter((f) => f.energy === energy);
      }
      // If no matches, return all
      if (forks.length === 0) {
        forks = MOCK_FORKS;
      }
      return { forks };
    }

    const params = new URLSearchParams();
    if (lane) params.append('lane', lane);
    if (energy) params.append('energy', energy);
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return this.request<FeedResponse>(`/feed?${params.toString()}`);
  }

  // Forks
  async getFork(id: string): Promise<Fork> {
    if (DEMO_MODE) {
      const fork = MOCK_FORKS.find((f) => f.id === id);
      if (fork) return fork;
      throw new Error('Fork not found');
    }
    return this.request<Fork>(`/forks/${id}`);
  }

  async createFork(input: CreateForkInput): Promise<Fork> {
    if (DEMO_MODE) {
      const newFork: Fork = {
        id: 'new-' + Date.now(),
        prompt: input.prompt,
        left_label: input.left_label,
        right_label: input.right_label,
        intent_lane: input.intent_lane,
        mood: input.mood,
        energy: input.energy,
        parent_fork_id: input.parent_fork_id,
        mutation_type: input.mutation_type,
        left_count: 0,
        right_count: 0,
        skip_count: 0,
        twist_count: 0,
        safety_age_gate: 'all',
        safety_flags: [],
        created_at: new Date().toISOString(),
      };
      MOCK_FORKS.unshift(newFork);
      return newFork;
    }

    return this.request<Fork>('/forks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async interact(
    forkId: string,
    type: InteractionType,
    dwellMs?: number
  ): Promise<void> {
    if (DEMO_MODE) {
      // Update mock counts
      const fork = MOCK_FORKS.find((f) => f.id === forkId);
      if (fork) {
        if (type === 'swipe_left') fork.left_count++;
        else if (type === 'swipe_right') fork.right_count++;
        else if (type === 'skip') fork.skip_count++;
        else if (type === 'twist') fork.twist_count++;
      }
      return;
    }

    await this.request(`/forks/${forkId}/interact`, {
      method: 'POST',
      body: JSON.stringify({ type, dwell_ms: dwellMs }),
    });
  }

  async reportFork(forkId: string, reason: string): Promise<void> {
    if (DEMO_MODE) {
      console.log('Demo: Reported fork', forkId, 'for', reason);
      return;
    }

    await this.request(`/forks/${forkId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // Intents
  async getIntents(): Promise<IntentsResponse> {
    // Always return static intents (same in demo and prod)
    return {
      lanes: [
        { id: 'discover', label: 'Discover', description: 'Explore new ideas and perspectives', emoji: '🔍' },
        { id: 'debate', label: 'Debate', description: 'Engage in friendly arguments', emoji: '⚔️' },
        { id: 'vibe', label: 'Vibe', description: 'Light-hearted fun and entertainment', emoji: '✨' },
        { id: 'reflect', label: 'Reflect', description: 'Deep thoughts and introspection', emoji: '🪞' },
        { id: 'decide', label: 'Decide', description: 'Help making real choices', emoji: '🎯' },
      ],
      energies: [
        { id: 'chill', label: 'Chill', description: 'Relaxed, low-stakes choices', emoji: '😌' },
        { id: 'balanced', label: 'Balanced', description: 'Mix of easy and engaging', emoji: '⚖️' },
        { id: 'intense', label: 'Intense', description: 'High-stakes, thought-provoking', emoji: '🔥' },
      ],
      moods: [
        { id: 'playful', label: 'Playful', emoji: '😄' },
        { id: 'serious', label: 'Serious', emoji: '🤔' },
        { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
        { id: 'wholesome', label: 'Wholesome', emoji: '💖' },
        { id: 'chaotic', label: 'Chaotic', emoji: '🌪️' },
      ],
    };
  }

  // Session
  async updateSession(lane: string, energy: string): Promise<void> {
    if (DEMO_MODE) {
      return;
    }

    await this.request('/session', {
      method: 'PUT',
      body: JSON.stringify({ lane, energy }),
    });
  }
}

export const api = new ApiClient();
