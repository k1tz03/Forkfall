import { useCallback, useEffect, useRef } from 'react';
import { useDeckStore } from '../store/deckStore';
import { useSessionStore } from '../store/sessionStore';
import { InteractionType } from '../types';

export function useForkDeck() {
  const { lane, energy } = useSessionStore();
  const {
    forks,
    currentIndex,
    isLoading,
    error,
    loadFeed,
    loadMore,
    interact,
    nextFork,
    reset,
  } = useDeckStore();

  const dwellStartRef = useRef<number>(Date.now());

  // Load feed on mount and when session changes
  useEffect(() => {
    if (lane) {
      reset();
      loadFeed(lane, energy || undefined);
    }
  }, [lane, energy]);

  // Track dwell time when viewing a fork
  useEffect(() => {
    dwellStartRef.current = Date.now();
  }, [currentIndex]);

  const currentFork = forks[currentIndex];
  const hasMore = currentIndex < forks.length - 1;
  const isEmpty = !isLoading && forks.length === 0;

  const handleSwipeLeft = useCallback(async () => {
    const dwellMs = Date.now() - dwellStartRef.current;
    await interact('swipe_left', dwellMs);
    nextFork();
  }, [interact, nextFork]);

  const handleSwipeRight = useCallback(async () => {
    const dwellMs = Date.now() - dwellStartRef.current;
    await interact('swipe_right', dwellMs);
    nextFork();
  }, [interact, nextFork]);

  const handleSkip = useCallback(async () => {
    const dwellMs = Date.now() - dwellStartRef.current;
    await interact('skip', dwellMs);
    nextFork();
  }, [interact, nextFork]);

  const handleTwist = useCallback(async () => {
    const dwellMs = Date.now() - dwellStartRef.current;
    await interact('twist', dwellMs);
  }, [interact]);

  const refresh = useCallback(() => {
    reset();
    loadFeed(lane || undefined, energy || undefined);
  }, [lane, energy, reset, loadFeed]);

  return {
    currentFork,
    forks,
    currentIndex,
    isLoading,
    error,
    hasMore,
    isEmpty,
    handleSwipeLeft,
    handleSwipeRight,
    handleSkip,
    handleTwist,
    refresh,
  };
}
