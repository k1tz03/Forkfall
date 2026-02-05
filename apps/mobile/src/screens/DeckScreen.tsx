import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SwipeDeck } from '../components/SwipeDeck';
import { ForkCard } from '../components/ForkCard';
import { useForkDeck } from '../hooks/useForkDeck';
import { useSessionStore } from '../store/sessionStore';
import { t } from '../i18n';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

// Web-safe wrapper
const SafeView = Platform.OS === 'web'
  ? ({ children, style }: { children: React.ReactNode; style?: any }) => (
      <View style={[{ flex: 1, paddingTop: 20 }, style]}>{children}</View>
    )
  : SafeAreaView;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Deck'>;

export function DeckScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { lane, energy, lanes, energies, resetSession } = useSessionStore();
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

  const handleHomePress = useCallback(async () => {
    await resetSession();
  }, [resetSession]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.homeButton} onPress={handleHomePress}>
        <Text style={styles.homeIcon}>🏠</Text>
      </TouchableOpacity>
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
          <Text style={styles.loadingText}>{t('deck.loadingForks')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😵</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (isEmpty) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>🍴</Text>
          <Text style={styles.emptyTitle}>{t('deck.noForks')}</Text>
          <Text style={styles.emptyText}>{t('deck.noForksSubtitle')}</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Create', {})}
          >
            <Text style={styles.createButtonText}>{t('deck.createFork')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!currentFork) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>{t('deck.allSeen')}</Text>
          <Text style={styles.emptyText}>{t('deck.allSeenSubtitle')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>{t('common.refresh')}</Text>
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

  const renderFooter = () => {
    // On web, SwipeDeck has its own buttons
    if (Platform.OS === 'web') {
      return null;
    }

    return (
      <View style={styles.footer}>
        <View style={styles.actionHints}>
          <View style={styles.hint}>
            <Text style={styles.hintArrow}>←</Text>
            <Text style={styles.hintText}>{t('deck.left')}</Text>
          </View>
          <View style={styles.hint}>
            <Text style={styles.hintArrow}>↑</Text>
            <Text style={styles.hintText}>{t('deck.skip')}</Text>
          </View>
          <View style={styles.hint}>
            <Text style={styles.hintArrow}>→</Text>
            <Text style={styles.hintText}>{t('deck.right')}</Text>
          </View>
        </View>
        <Text style={styles.twistHint}>{t('deck.holdToTwist')}</Text>
      </View>
    );
  };

  return (
    <SafeView style={styles.container}>
      {renderHeader()}
      <View style={styles.deckContainer}>{renderContent()}</View>
      {currentFork && renderFooter()}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  homeIcon: {
    fontSize: 20,
  },
  sessionInfo: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
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
