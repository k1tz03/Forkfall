import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SwipeDeck } from '../components/SwipeDeck';
import { ForkCard } from '../components/ForkCard';
import { useForkDeck } from '../hooks/useForkDeck';
import { useSessionStore } from '../store/sessionStore';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Deck'>;

export function DeckScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { lane, energy, lanes, energies } = useSessionStore();
  const {
    currentFork,
    isLoading,
    error,
    isEmpty,
    handleSwipeLeft,
    handleSwipeRight,
    handleSkip,
    handleTwist,
    refresh,
  } = useForkDeck();

  const currentLane = lanes.find((l) => l.id === lane);
  const currentEnergy = energies.find((e) => e.id === energy);

  const handleTwistPress = useCallback(() => {
    if (currentFork) {
      handleTwist();
      navigation.navigate('Create', { parentForkId: currentFork.id });
    }
  }, [currentFork, handleTwist, navigation]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.sessionInfo}>
        {currentLane && (
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionEmoji}>{currentLane.emoji}</Text>
            <Text style={styles.sessionText}>{currentLane.label}</Text>
          </View>
        )}
        {currentEnergy && (
          <View style={styles.sessionBadge}>
            <Text style={styles.sessionEmoji}>{currentEnergy.emoji}</Text>
            <Text style={styles.sessionText}>{currentEnergy.label}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading && !currentFork) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading forks...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😵</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isEmpty) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>🍴</Text>
          <Text style={styles.emptyTitle}>No forks yet!</Text>
          <Text style={styles.emptyText}>
            Check back soon or create your own fork.
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Create', {})}
          >
            <Text style={styles.createButtonText}>Create Fork</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!currentFork) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>You've seen them all!</Text>
          <Text style={styles.emptyText}>
            Come back later for more forks.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <SwipeDeck
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSkip}
        onLongPress={handleTwistPress}
      >
        <ForkCard fork={currentFork} />
      </SwipeDeck>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.actionHints}>
        <View style={styles.hint}>
          <Text style={styles.hintArrow}>←</Text>
          <Text style={styles.hintText}>Left</Text>
        </View>
        <View style={styles.hint}>
          <Text style={styles.hintArrow}>↑</Text>
          <Text style={styles.hintText}>Skip</Text>
        </View>
        <View style={styles.hint}>
          <Text style={styles.hintArrow}>→</Text>
          <Text style={styles.hintText}>Right</Text>
        </View>
      </View>
      <Text style={styles.twistHint}>Hold to twist</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.deckContainer}>{renderContent()}</View>
      {currentFork && renderFooter()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sessionInfo: {
    flexDirection: 'row',
    gap: 8,
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  sessionEmoji: {
    fontSize: 14,
  },
  sessionText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  deckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionHints: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  hint: {
    alignItems: 'center',
  },
  hintArrow: {
    fontSize: 24,
    color: '#6366f1',
  },
  hintText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  twistHint: {
    fontSize: 12,
    color: '#6b7280',
  },
});
