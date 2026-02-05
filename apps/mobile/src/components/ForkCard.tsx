import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Fork } from '../types';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const CARD_HEIGHT = height * 0.55;

interface ForkCardProps {
  fork: Fork;
}

export function ForkCard({ fork }: ForkCardProps) {
  const totalVotes = fork.left_count + fork.right_count;
  const leftPercentage = totalVotes > 0 ? Math.round((fork.left_count / totalVotes) * 100) : 50;
  const rightPercentage = totalVotes > 0 ? 100 - leftPercentage : 50;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.prompt}>{fork.prompt}</Text>

        <View style={styles.options}>
          <View style={styles.option}>
            <View style={[styles.optionIndicator, styles.leftIndicator]} />
            <Text style={styles.optionLabel}>{fork.left_label}</Text>
            {totalVotes > 0 && (
              <Text style={styles.percentage}>{leftPercentage}%</Text>
            )}
          </View>

          <View style={styles.divider}>
            <Text style={styles.orText}>OR</Text>
          </View>

          <View style={styles.option}>
            <View style={[styles.optionIndicator, styles.rightIndicator]} />
            <Text style={styles.optionLabel}>{fork.right_label}</Text>
            {totalVotes > 0 && (
              <Text style={styles.percentage}>{rightPercentage}%</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalVotes}</Text>
            <Text style={styles.statLabel}>votes</Text>
          </View>
          {fork.twist_count > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{fork.twist_count}</Text>
              <Text style={styles.statLabel}>twists</Text>
            </View>
          )}
        </View>

        <View style={styles.badges}>
          {fork.mood && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getMoodEmoji(fork.mood)}</Text>
            </View>
          )}
          {fork.parent_fork_id && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🔀 twist</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    playful: '😄',
    serious: '🤔',
    spicy: '🌶️',
    wholesome: '💖',
    chaotic: '🌪️',
  };
  return moods[mood] || mood;
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#2d2d44',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  prompt: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 36,
  },
  options: {
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d5c',
    padding: 20,
    borderRadius: 16,
  },
  optionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  leftIndicator: {
    backgroundColor: '#f472b6',
  },
  rightIndicator: {
    backgroundColor: '#60a5fa',
  },
  optionLabel: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  percentage: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
  },
  divider: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  orText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#3d3d5c',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#3d3d5c',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#ffffff',
  },
});
