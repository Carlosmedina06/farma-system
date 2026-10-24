import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const PROGRESS_ANIMATION_MS = 400
const CYCLE_RESET_THRESHOLD = 5

export interface SteppedProgressBarProps {
  progress: number
  testID?: string
}

export default function SteppedProgressBar({ progress, testID }: SteppedProgressBarProps) {
  const animatedProgress = useSharedValue(0)

  useEffect(() => {
    const clampedProgress = Math.min(100, Math.max(0, progress))

    if (clampedProgress < animatedProgress.value - CYCLE_RESET_THRESHOLD) {
      cancelAnimation(animatedProgress)
      animatedProgress.value = 0
    }

    animatedProgress.value = withTiming(clampedProgress, {
      duration: PROGRESS_ANIMATION_MS,
      easing: Easing.linear,
    })
  }, [animatedProgress, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }))

  return (
    <View
      className="h-2 self-stretch overflow-hidden rounded-lg bg-gray-300"
      testID={testID ?? 'stepped-progress-bar'}
    >
      <Animated.View className="bg-primary-600 flex-1 rounded-lg" style={animatedStyle} />
    </View>
  )
}
