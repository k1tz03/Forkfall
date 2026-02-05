import React, { useRef, useCallback, ReactNode } from 'react';
import { View, StyleSheet, Dimensions, Vibration } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;
const SWIPE_UP_THRESHOLD = height * 0.15;
const LONG_PRESS_DURATION = 500;

interface SwipeDeckProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onLongPress: () => void;
}

export function SwipeDeck({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onLongPress,
}: SwipeDeckProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isLongPressed = useSharedValue(false);

  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      Vibration.vibrate(10);
      if (direction === 'left') {
        onSwipeLeft();
      } else if (direction === 'right') {
        onSwipeRight();
      } else {
        onSwipeUp();
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const handleLongPress = useCallback(() => {
    Vibration.vibrate(50);
    onLongPress();
  }, [onLongPress]);

  const resetPosition = useCallback(() => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    scale.value = withSpring(1, { damping: 20, stiffness: 200 });
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;

      // Check for swipe up first
      if (translationY < -SWIPE_UP_THRESHOLD || velocityY < -500) {
        translateY.value = withTiming(-height, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)('up');
          translateX.value = 0;
          translateY.value = 0;
        });
        return;
      }

      // Check for horizontal swipes
      if (Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500) {
        const direction = translationX > 0 ? 'right' : 'left';
        const targetX = translationX > 0 ? width * 1.5 : -width * 1.5;

        translateX.value = withTiming(targetX, { duration: 200 }, () => {
          runOnJS(handleSwipeComplete)(direction);
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        // Reset position
        runOnJS(resetPosition)();
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(LONG_PRESS_DURATION)
    .onStart(() => {
      isLongPressed.value = true;
      scale.value = withSpring(0.95, { damping: 15 });
      runOnJS(handleLongPress)();
    })
    .onEnd(() => {
      isLongPressed.value = false;
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

  const leftOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const skipOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [-SWIPE_UP_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
          {children}

          {/* Left overlay (pink) */}
          <Animated.View
            style={[styles.overlay, styles.leftOverlay, leftOverlayStyle]}
            pointerEvents="none"
          >
            <View style={styles.overlayContent}>
              <View style={[styles.overlayCircle, styles.leftCircle]}>
                <Animated.Text style={styles.overlayArrow}>←</Animated.Text>
              </View>
            </View>
          </Animated.View>

          {/* Right overlay (blue) */}
          <Animated.View
            style={[styles.overlay, styles.rightOverlay, rightOverlayStyle]}
            pointerEvents="none"
          >
            <View style={styles.overlayContent}>
              <View style={[styles.overlayCircle, styles.rightCircle]}>
                <Animated.Text style={styles.overlayArrow}>→</Animated.Text>
              </View>
            </View>
          </Animated.View>

          {/* Skip overlay (gray) */}
          <Animated.View
            style={[styles.overlay, styles.skipOverlay, skipOverlayStyle]}
            pointerEvents="none"
          >
            <View style={styles.overlayContent}>
              <View style={[styles.overlayCircle, styles.skipCircle]}>
                <Animated.Text style={styles.overlayArrow}>↑</Animated.Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftOverlay: {
    backgroundColor: 'rgba(244, 114, 182, 0.3)',
  },
  rightOverlay: {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
  },
  skipOverlay: {
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  overlayCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
  },
  leftCircle: {
    borderColor: '#f472b6',
    backgroundColor: 'rgba(244, 114, 182, 0.2)',
  },
  rightCircle: {
    borderColor: '#60a5fa',
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
  },
  skipCircle: {
    borderColor: '#6b7280',
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
  },
  overlayArrow: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
