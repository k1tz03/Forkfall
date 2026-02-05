import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';
import { IntentOption } from '../types';

const SESSION_KEY = 'forkfall_session';

// Storage abstraction for web/native
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
};

interface SessionState {
  lane: string | null;
  energy: string | null;
  lanes: IntentOption[];
  energies: IntentOption[];
  moods: IntentOption[];
  isLoading: boolean;

  loadSession: () => Promise<void>;
  setIntent: (lane: string, energy: string) => Promise<void>;
  loadIntents: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  lane: null,
  energy: null,
  lanes: [],
  energies: [],
  moods: [],
  isLoading: false,

  loadSession: async () => {
    try {
      const sessionData = await storage.getItem(SESSION_KEY);
      if (sessionData) {
        const { lane, energy } = JSON.parse(sessionData);
        set({ lane, energy });
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  },

  setIntent: async (lane: string, energy: string) => {
    try {
      await storage.setItem(
        SESSION_KEY,
        JSON.stringify({ lane, energy })
      );

      // Update backend session
      try {
        await api.updateSession(lane, energy);
      } catch (error) {
        // Continue even if backend update fails
        console.warn('Failed to sync session with backend:', error);
      }

      set({ lane, energy });
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  loadIntents: async () => {
    set({ isLoading: true });

    try {
      const intents = await api.getIntents();
      set({
        lanes: intents.lanes,
        energies: intents.energies,
        moods: intents.moods,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load intents:', error);
      // Fallback to default intents
      set({
        lanes: [
          { id: 'discover', label: 'Discover', emoji: '🔍' },
          { id: 'debate', label: 'Debate', emoji: '⚔️' },
          { id: 'vibe', label: 'Vibe', emoji: '✨' },
          { id: 'reflect', label: 'Reflect', emoji: '🪞' },
          { id: 'decide', label: 'Decide', emoji: '🎯' },
        ],
        energies: [
          { id: 'chill', label: 'Chill', emoji: '😌' },
          { id: 'balanced', label: 'Balanced', emoji: '⚖️' },
          { id: 'intense', label: 'Intense', emoji: '🔥' },
        ],
        moods: [
          { id: 'playful', label: 'Playful', emoji: '😄' },
          { id: 'serious', label: 'Serious', emoji: '🤔' },
          { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
          { id: 'wholesome', label: 'Wholesome', emoji: '💖' },
          { id: 'chaotic', label: 'Chaotic', emoji: '🌪️' },
        ],
        isLoading: false,
      });
    }
  },
}));
