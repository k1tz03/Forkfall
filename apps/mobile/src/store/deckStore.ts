import { create } from 'zustand';
import { api } from '../services/api';
import { Fork, InteractionType } from '../types';

interface DeckState {
  forks: Fork[];
  currentIndex: number;
  cursor: string | null;
  isLoading: boolean;
  error: string | null;

  loadFeed: (lane?: string, energy?: string) => Promise<void>;
  loadMore: (lane?: string, energy?: string) => Promise<void>;
  interact: (type: InteractionType, dwellMs?: number) => Promise<void>;
  nextFork: () => void;
  reset: () => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  forks: [],
  currentIndex: 0,
  cursor: null,
  isLoading: false,
  error: null,

  loadFeed: async (lane?: string, energy?: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.getFeed(lane, energy, undefined, 20);
      set({
        forks: response.forks,
        currentIndex: 0,
        cursor: response.next_cursor || null,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load feed';
      set({ error: message, isLoading: false });
    }
  },

  loadMore: async (lane?: string, energy?: string) => {
    const { cursor, forks, isLoading } = get();

    if (isLoading || !cursor) return;

    set({ isLoading: true });

    try {
      const response = await api.getFeed(lane, energy, cursor, 20);
      set({
        forks: [...forks, ...response.forks],
        cursor: response.next_cursor || null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load more:', error);
      set({ isLoading: false });
    }
  },

  interact: async (type: InteractionType, dwellMs?: number) => {
    const { forks, currentIndex } = get();
    const currentFork = forks[currentIndex];

    if (!currentFork) return;

    try {
      await api.interact(currentFork.id, type, dwellMs);
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }
  },

  nextFork: () => {
    const { currentIndex, forks, cursor } = get();
    const nextIndex = currentIndex + 1;

    set({ currentIndex: nextIndex });

    // Preload more when running low
    if (nextIndex >= forks.length - 5 && cursor) {
      get().loadMore();
    }
  },

  reset: () => {
    set({
      forks: [],
      currentIndex: 0,
      cursor: null,
      error: null,
    });
  },
}));
