import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { api } from '../services/api';
import { useSessionStore } from '../store/sessionStore';
import { useDeckStore } from '../store/deckStore';
import { Fork } from '../types';
import { t } from '../i18n';
import { RootStackParamList } from '../../App';

// Web-safe wrapper
const SafeView = Platform.OS === 'web'
  ? ({ children, style }: { children: React.ReactNode; style?: any }) => (
      <View style={[{ flex: 1, paddingTop: 20 }, style]}>{children}</View>
    )
  : SafeAreaView;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Create'>;
type RouteProps = RouteProp<RootStackParamList, 'Create'>;

const MUTATION_TYPES = [
  { id: 'flip', labelKey: 'create.mutations.flip', descKey: 'create.mutations.flipDesc', emoji: '🔄' },
  { id: 'reframe', labelKey: 'create.mutations.reframe', descKey: 'create.mutations.reframeDesc', emoji: '🎭' },
  { id: 'escalate', labelKey: 'create.mutations.escalate', descKey: 'create.mutations.escalateDesc', emoji: '🔥' },
  { id: 'specific', labelKey: 'create.mutations.specific', descKey: 'create.mutations.specificDesc', emoji: '🎯' },
];

export function CreateScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { parentForkId } = route.params || {};

  const { lane, energy, lanes, moods } = useSessionStore();
  const { loadFeed } = useDeckStore();

  const [parentFork, setParentFork] = useState<Fork | null>(null);
  const [prompt, setPrompt] = useState('');
  const [leftLabel, setLeftLabel] = useState('');
  const [rightLabel, setRightLabel] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedMutation, setSelectedMutation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (parentForkId) {
      loadParentFork();
    }
  }, [parentForkId]);

  const loadParentFork = async () => {
    if (!parentForkId) return;

    try {
      const fork = await api.getFork(parentForkId);
      setParentFork(fork);
      // Pre-fill with parent data for twisting
      setPrompt(fork.prompt);
      setLeftLabel(fork.left_label);
      setRightLabel(fork.right_label);
      if (fork.mood) setSelectedMood(fork.mood);
    } catch (error) {
      console.error('Failed to load parent fork:', error);
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !leftLabel.trim() || !rightLabel.trim()) {
      setError(t('create.errors.fillAllFields'));
      return;
    }

    if (prompt.length > 90) {
      setError(t('create.errors.promptTooLong'));
      return;
    }

    if (leftLabel.length > 24 || rightLabel.length > 24) {
      setError(t('create.errors.labelsTooLong'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.createFork({
        prompt: prompt.trim(),
        left_label: leftLabel.trim(),
        right_label: rightLabel.trim(),
        intent_lane: lane || 'vibe',
        energy: energy || 'balanced',
        mood: selectedMood || undefined,
        parent_fork_id: parentForkId,
        mutation_type: selectedMutation || undefined,
      });

      // Refresh feed to include new fork
      loadFeed(lane || undefined, energy || undefined);
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('create.errors.createFailed');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = prompt.trim() && leftLabel.trim() && rightLabel.trim();

  return (
    <SafeView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {parentFork ? t('create.twistFork') : t('create.newFork')}
          </Text>
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>{t('common.post')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          {parentFork && (
            <View style={styles.parentInfo}>
              <Text style={styles.parentLabel}>{t('create.twistingFrom')}</Text>
              <Text style={styles.parentPrompt}>{parentFork.prompt}</Text>
            </View>
          )}

          {parentFork && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('create.mutationType')}</Text>
              <View style={styles.mutationGrid}>
                {MUTATION_TYPES.map((mutation) => (
                  <TouchableOpacity
                    key={mutation.id}
                    style={[
                      styles.mutationOption,
                      selectedMutation === mutation.id && styles.mutationOptionSelected,
                    ]}
                    onPress={() => setSelectedMutation(mutation.id)}
                  >
                    <Text style={styles.mutationEmoji}>{mutation.emoji}</Text>
                    <Text style={styles.mutationLabel}>{t(mutation.labelKey)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              {t('create.prompt')} ({t('create.charsLeft', { count: 90 - prompt.length })})
            </Text>
            <TextInput
              style={styles.promptInput}
              placeholder={t('create.placeholderPrompt')}
              placeholderTextColor="#6b7280"
              value={prompt}
              onChangeText={setPrompt}
              maxLength={90}
              multiline
            />
          </View>

          <View style={styles.labelsRow}>
            <View style={styles.labelContainer}>
              <Text style={styles.sectionLabel}>{t('create.leftOption')} ({24 - leftLabel.length})</Text>
              <TextInput
                style={styles.labelInput}
                placeholder={t('create.placeholderOptionA')}
                placeholderTextColor="#6b7280"
                value={leftLabel}
                onChangeText={setLeftLabel}
                maxLength={24}
              />
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.sectionLabel}>{t('create.rightOption')} ({24 - rightLabel.length})</Text>
              <TextInput
                style={styles.labelInput}
                placeholder={t('create.placeholderOptionB')}
                placeholderTextColor="#6b7280"
                value={rightLabel}
                onChangeText={setRightLabel}
                maxLength={24}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('create.mood')}</Text>
            <View style={styles.moodGrid}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.id && styles.moodOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedMood(selectedMood === mood.id ? null : mood.id)
                  }
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  parentInfo: {
    backgroundColor: '#2d2d44',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  parentLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
  },
  parentPrompt: {
    fontSize: 16,
    color: '#ffffff',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  promptInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: '#ffffff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  labelsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  labelContainer: {
    flex: 1,
  },
  labelInput: {
    backgroundColor: '#2d2d44',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  mutationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mutationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  mutationOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#3d3d5c',
  },
  mutationEmoji: {
    fontSize: 16,
  },
  mutationLabel: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  moodOptionSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#3d3d5c',
  },
  moodEmoji: {
    fontSize: 14,
  },
  moodLabel: {
    fontSize: 14,
    color: '#ffffff',
  },
  errorContainer: {
    backgroundColor: '#450a0a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
  },
});
