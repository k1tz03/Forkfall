import React, { useRef, useCallback, ReactNode } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SwipeDeckProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onLongPress: () => void;
}

// Simple web-compatible version
function SwipeDeckWeb({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onLongPress,
}: SwipeDeckProps) {
  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>{children}</View>
      <View style={styles.webButtons}>
        <Pressable
          style={[styles.webButton, styles.leftButton]}
          onPress={onSwipeLeft}
        >
          <Text style={styles.webButtonText}>← Left</Text>
        </Pressable>
        <Pressable
          style={[styles.webButton, styles.skipButton]}
          onPress={onSwipeUp}
        >
          <Text style={styles.webButtonText}>↑ Skip</Text>
        </Pressable>
        <Pressable
          style={[styles.webButton, styles.rightButton]}
          onPress={onSwipeRight}
        >
          <Text style={styles.webButtonText}>Right →</Text>
        </Pressable>
      </View>
      <Pressable style={styles.twistButton} onPress={onLongPress}>
        <Text style={styles.twistButtonText}>🔀 Twist this fork</Text>
      </Pressable>
    </View>
  );
}

// Native version with gestures
function SwipeDeckNative({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onLongPress,
}: SwipeDeckProps) {
  const {
    Gesture,
    GestureDetector,
  } = require('react-native-gesture-handler');
  const Animated = require('react-native-reanimated');
  const {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
  } = Animated;

  const SWIPE_THRESHOLD = width * 0.25;
  const SWIPE_UP_THRESHOLD = height * 0.15;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      if (direction === 'left') onSwipeLeft();
      else if (direction === 'right') onSwipeRight();
      else onSwipeUp();
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const resetPosition = useCallback(() => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event: any) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event: any) => {
      const { translationX, translationY, velocityX, velocityY } = event;

      if (translationY < -SWIPE_UP_THRESHOLD || velocityY < -500) {
        translateY.value = withTiming(-height, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)('up');
          translateX.value = 0;
          translateY.value = 0;
        });
        return;
      }

      if (Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500) {
        const direction = translationX > 0 ? 'right' : 'left';
        const targetX = translationX > 0 ? width * 1.5 : -width * 1.5;

        translateX.value = withTiming(targetX, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)(direction);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        runOnJS(resetPosition)();
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      scale.value = withSpring(0.95, { damping: 15 });
      runOnJS(onLongPress)();
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15 });
    });

  const composedGesture = Gesture.Race(longPressGesture, panGesture);

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-width / 2, 0, width / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.default.View style={[styles.cardContainer, animatedCardStyle]}>
          {children}
        </Animated.default.View>
      </GestureDetector>
    </View>
  );
}

export function SwipeDeck(props: SwipeDeckProps) {
  if (Platform.OS === 'web') {
    return <SwipeDeckWeb {...props} />;
  }
  return <SwipeDeckNative {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  webButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  webButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  leftButton: {
    backgroundColor: '#f472b6',
  },
  skipButton: {
    backgroundColor: '#6b7280',
  },
  rightButton: {
    backgroundColor: '#60a5fa',
  },
  webButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  twistButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2d2d44',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  twistButtonText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
});
