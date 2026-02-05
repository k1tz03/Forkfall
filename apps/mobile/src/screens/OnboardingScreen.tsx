import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSessionStore } from '../store/sessionStore';

// Web-safe wrapper
const SafeView = Platform.OS === 'web'
  ? ({ children, style }: { children: React.ReactNode; style?: any }) => (
      <View style={[{ flex: 1, paddingTop: 40 }, style]}>{children}</View>
    )
  : SafeAreaView;

const { width } = Dimensions.get('window');

type Step = 'welcome' | 'lane' | 'energy' | 'ready';

export function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [selectedLane, setSelectedLane] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);

  const { lanes, energies, isLoading, loadIntents, setIntent } = useSessionStore();

  useEffect(() => {
    loadIntents();
  }, []);

  const handleComplete = async () => {
    if (selectedLane && selectedEnergy) {
      await setIntent(selectedLane, selectedEnergy);
    }
  };

  const renderWelcome = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.logo}>🍴</Text>
      <Text style={styles.title}>FORKFALL</Text>
      <Text style={styles.subtitle}>
        Every choice tells a story.{'\n'}Make yours count.
      </Text>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setStep('lane')}
      >
        <Text style={styles.primaryButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLaneSelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What brings you here?</Text>
      <Text style={styles.stepSubtitle}>Choose your lane</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#6366f1" />
      ) : (
        <View style={styles.optionsGrid}>
          {lanes.map((lane) => (
            <TouchableOpacity
              key={lane.id}
              style={[
                styles.optionCard,
                selectedLane === lane.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedLane(lane.id)}
            >
              <Text style={styles.optionEmoji}>{lane.emoji}</Text>
              <Text style={styles.optionLabel}>{lane.label}</Text>
              {lane.description && (
                <Text style={styles.optionDescription}>{lane.description}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[styles.primaryButton, !selectedLane && styles.buttonDisabled]}
        onPress={() => selectedLane && setStep('energy')}
        disabled={!selectedLane}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEnergySelection = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What's your vibe today?</Text>
      <Text style={styles.stepSubtitle}>Set your energy level</Text>

      <View style={styles.energyOptions}>
        {energies.map((energy) => (
          <TouchableOpacity
            key={energy.id}
            style={[
              styles.energyCard,
              selectedEnergy === energy.id && styles.energyCardSelected,
            ]}
            onPress={() => setSelectedEnergy(energy.id)}
          >
            <Text style={styles.energyEmoji}>{energy.emoji}</Text>
            <Text style={styles.energyLabel}>{energy.label}</Text>
            {energy.description && (
              <Text style={styles.energyDescription}>{energy.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setStep('lane')}
        >
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, styles.buttonFlex, !selectedEnergy && styles.buttonDisabled]}
          onPress={() => selectedEnergy && setStep('ready')}
          disabled={!selectedEnergy}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReady = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.readyEmoji}>🎉</Text>
      <Text style={styles.title}>You're all set!</Text>
      <Text style={styles.subtitle}>
        Swipe left or right to make your choice.{'\n'}
        Hold to twist and create your own fork.
      </Text>

      <View style={styles.instructionRow}>
        <View style={styles.instruction}>
          <Text style={styles.instructionIcon}>👈</Text>
          <Text style={styles.instructionText}>Left</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.instructionIcon}>👆</Text>
          <Text style={styles.instructionText}>Skip</Text>
        </View>
        <View style={styles.instruction}>
          <Text style={styles.instructionIcon}>👉</Text>
          <Text style={styles.instructionText}>Right</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleComplete}
      >
        <Text style={styles.primaryButtonText}>Start Forking</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 'welcome' && renderWelcome()}
        {step === 'lane' && renderLaneSelection()}
        {step === 'energy' && renderEnergySelection()}
        {step === 'ready' && renderReady()}
      </ScrollView>

      {step !== 'welcome' && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    step === 'lane'
                      ? '33%'
                      : step === 'energy'
                      ? '66%'
                      : '100%',
                },
              ]}
            />
          </View>
        </View>
      )}
    </SafeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  stepContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    width: (width - 72) / 2,
    padding: 16,
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#3d3d5c',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  energyOptions: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  energyCard: {
    padding: 20,
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  energyCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#3d3d5c',
  },
  energyEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  energyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  energyDescription: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 'auto',
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4b5563',
    marginRight: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  readyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  instructionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  instruction: {
    alignItems: 'center',
  },
  instructionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2d2d44',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
});
