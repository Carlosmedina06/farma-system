import React, { useEffect } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  SharedValue,
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { View } from 'react-native'

import { dotSize, pointToValue, valueToPoint } from './Slider.types'

type SliderDotProps = {
  sliderWidth: number
  currentPosition: SharedValue<number>
  onChange: (value: number) => void
  value: number
  min: number
  max: number
}

const AnimatedDot = Animated.createAnimatedComponent(View)

export const SliderDot: React.FC<SliderDotProps> = ({
  sliderWidth,
  currentPosition,
  onChange,
  value,
  min,
  max,
}) => {
  const position = useSharedValue(value)
  const translationX = useSharedValue(0)
  const scale = useSharedValue(1)

  const updateValue = (point: number) => {
    onChange(pointToValue({ point, min, max, width: sliderWidth }))
  }

  const pan = Gesture.Pan()
    .onUpdate((p) => {
      translationX.value = p.translationX
      scale.value = withTiming(1.2, { duration: 200 })
      currentPosition.value = clamp(position.value + translationX.value, 0, sliderWidth)
    })
    .onEnd((p) => {
      position.value = position.value + p.translationX
      translationX.value = 0
      scale.value = withTiming(1, { duration: 200 })
      currentPosition.value = clamp(position.value, 0, sliderWidth)
      runOnJS(updateValue)(currentPosition.value)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: clamp(position.value + translationX.value, 0, sliderWidth - dotSize / 2) },
      { scale: scale.value },
    ],
  }))

  useEffect(() => {
    const newPosition = valueToPoint({ value, min, max, width: sliderWidth })

    position.value = withTiming(newPosition)
    currentPosition.value = withTiming(newPosition)
  }, [value, sliderWidth, min, max, position, currentPosition])

  return (
    <GestureDetector gesture={pan}>
      <AnimatedDot
        className="border-primary-600 bg-base-white absolute h-[28px] w-[28px] rounded-full border"
        style={animatedStyle}
      />
    </GestureDetector>
  )
}
