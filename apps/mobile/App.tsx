import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

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

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { token, loadToken, authenticate } = useAuthStore();
  const { lane, loadSession } = useSessionStore();

  useEffect(() => {
    const init = async () => {
      await loadToken();
      await loadSession();

      // Auto-authenticate if no token
      const storedToken = useAuthStore.getState().token;
      if (!storedToken) {
        await authenticate();
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a2e' },
            animation: 'slide_from_right',
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
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
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
