import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'

const DEFAULT_PROGRESS_BAR_DURATION_MS = 2000

export interface AnimatedProgressBarProps {
  durationMs?: number
}

export const AnimatedProgressBar = ({
  durationMs = DEFAULT_PROGRESS_BAR_DURATION_MS,
}: AnimatedProgressBarProps) => {
  const reduceMotion = useReducedMotion()
  const animatedProgress = useSharedValue(0)

  useEffect(() => {
    if (reduceMotion) {
      animatedProgress.value = 100

      return
    }

    animatedProgress.value = withRepeat(
      withTiming(100, { duration: durationMs, easing: Easing.linear }),
      -1,
      false,
    )
  }, [animatedProgress, durationMs, reduceMotion])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }))

  return (
    <View className="h-2 self-stretch overflow-hidden rounded-lg bg-gray-300">
      <Animated.View className="bg-primary-600 flex-1 rounded-lg" style={animatedStyle} />
    </View>
  )
}
