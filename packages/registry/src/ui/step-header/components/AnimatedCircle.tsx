import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { AnimatedStepCircleProps } from './AnimatedCircle.types'

const getProgressTarget = (isActive: boolean, isCompleted: boolean): number => {
  if (isCompleted) return 2
  if (isActive) return 1

  return 0
}

const AnimatedStepCircle = ({
  isActive,
  isCompleted,
  stepNumber,
  stepTitle,
}: AnimatedStepCircleProps) => {
  const reduceMotion = useReducedMotion()
  const scale = useSharedValue(1)
  const progress = useSharedValue(0)
  const textOpacity = useSharedValue(1)
  const iconOpacity = useSharedValue(0)
  const iconScale = useSharedValue(0.5)

  useEffect(() => {
    if (reduceMotion) {
      scale.value = 1
      progress.value = getProgressTarget(isActive, isCompleted)
      textOpacity.value = isCompleted ? 0 : 1
      iconOpacity.value = isCompleted ? 1 : 0
      iconScale.value = isCompleted ? 1 : 0.5

      return
    }

    if (isActive || isCompleted) {
      scale.value = withSequence(
        withTiming(1.1, {
          duration: 200,
          easing: Easing.elastic(1.2),
        }),
        withTiming(1, { duration: 150 }),
      )
    }

    if (isActive) {
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) })
    } else if (isCompleted) {
      progress.value = withTiming(2, { duration: 300, easing: Easing.out(Easing.quad) })
    } else {
      progress.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.quad) })
    }

    if (isCompleted) {
      textOpacity.value = withTiming(0, { duration: 200 })
      iconOpacity.value = withTiming(1, { duration: 200 })
      iconScale.value = withTiming(1, { duration: 200 })
    } else {
      textOpacity.value = withTiming(1, { duration: 200 })
      iconOpacity.value = withTiming(0, { duration: 200 })
      iconScale.value = withTiming(0.5, { duration: 200 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isCompleted, reduceMotion])

  const animatedCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1, 2],
      ['#eeeffe', '#2563EB', '#eeeffe'],
    )

    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }))

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
    position: 'absolute',
  }))

  const animatedStepTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1, 2], ['#6B7280', '#2563EB', '#2563EB'])

    return {
      color,
    }
  })

  return (
    <View className="shrink-0 items-center gap-2">
      <Animated.View
        className="h-8 w-8 items-center justify-center rounded-2xl"
        style={animatedCircleStyle}
      >
        <Animated.View style={animatedTextStyle}>
          <Text semibold className={isActive ? 'text-base-white' : 'text-gray-500'}>
            {stepNumber}
          </Text>
        </Animated.View>

        <Animated.View style={animatedIconStyle}>
          <Icon color="#2563EB" name="check" size={24} />
        </Animated.View>
      </Animated.View>

      <Animated.Text
        className="text-center text-xs"
        style={[
          {
            fontWeight: isActive ? '600' : '400',
          },
          animatedStepTextStyle,
        ]}
      >
        {stepTitle}
      </Animated.Text>
    </View>
  )
}

export default AnimatedStepCircle
