import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';

import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { DeckScreen } from './src/screens/DeckScreen';
import { CreateScreen } from './src/screens/CreateScreen';
import { useAuthStore } from './src/store/authStore';
import { useSessionStore } from './src/store/sessionStore';

export type RootStackParamList = {
  Onboarding: undefined;
  Deck: undefined;
  Create: { parentForkId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Web-compatible linking config
const linking = {
  prefixes: [],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Deck: '',
      Create: 'create',
    },
  },
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { loadToken, authenticate } = useAuthStore();
  const { lane, loadSession } = useSessionStore();

  useEffect(() => {
    const init = async () => {
      try {
        await loadToken();
        await loadSession();

        const storedToken = useAuthStore.getState().token;
        if (!storedToken) {
          await authenticate();
        }
      } catch (error) {
        console.error('Init error:', error);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const needsOnboarding = !lane;

  const content = (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: Platform.OS === 'web' ? 'none' : 'slide_from_right',
        }}
      >
        {needsOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Deck" component={DeckScreen} />
            <Stack.Screen
              name="Create"
              component={CreateScreen}
              options={{
                presentation: Platform.OS === 'web' ? 'card' : 'modal',
                animation: Platform.OS === 'web' ? 'none' : 'slide_from_bottom',
              }}
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );

  // On web, don't wrap with GestureHandlerRootView
  if (Platform.OS === 'web') {
    return <View style={styles.container}>{content}</View>;
  }

  // On native, use gesture handler
  const { GestureHandlerRootView } = require('react-native-gesture-handler');
  return (
    <GestureHandlerRootView style={styles.container}>
      {content}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});
