import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';

const TOKEN_KEY = 'forkfall_token';
const ACTOR_ID_KEY = 'forkfall_actor_id';

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
  async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

interface AuthState {
  token: string | null;
  actorId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  loadToken: () => Promise<void>;
  authenticate: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  actorId: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadToken: async () => {
    try {
      const token = await storage.getItem(TOKEN_KEY);
      const actorId = await storage.getItem(ACTOR_ID_KEY);

      if (token) {
        api.setToken(token);
        set({
          token,
          actorId,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to load token:', error);
    }
  },

  authenticate: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await api.authenticateDevice();

      await storage.setItem(TOKEN_KEY, result.token);
      await storage.setItem(ACTOR_ID_KEY, result.actor_id);

      api.setToken(result.token);

      set({
        token: result.token,
        actorId: result.actor_id,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      set({ error: message, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await storage.deleteItem(TOKEN_KEY);
      await storage.deleteItem(ACTOR_ID_KEY);

      api.setToken(null);

      set({
        token: null,
        actorId: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  },
}));
