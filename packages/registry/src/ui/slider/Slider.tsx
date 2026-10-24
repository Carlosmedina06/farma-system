import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import Animated, { clamp, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@farma/registry/lib/utils'

import { SliderDot } from './SliderDot'
import { SliderProps, dotSize } from './Slider.types'

const AnimatedLine = Animated.createAnimatedComponent(View)

export const Slider = ({
  value = 0,
  onChange,
  min = 1,
  max = 100,
  className,
  testID,
  ...props
}: SliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0)
  const currentPosition = useSharedValue(0)

  const updateContainerWidth = (e: LayoutChangeEvent) => {
    setSliderWidth(e.nativeEvent.layout.width)
  }

  const blueLineStyle = useAnimatedStyle(() => ({
    width: clamp(currentPosition.value + dotSize / 2, 0, sliderWidth),
  }))

  return (
    <View
      {...props}
      className={cn(
        'h-2 flex-row items-center self-stretch overflow-visible rounded-sm bg-gray-200',
        className,
      )}
      style={{ marginVertical: dotSize / 2 }}
      testID={testID}
      onLayout={updateContainerWidth}
    >
      <AnimatedLine className="bg-primary-600 absolute h-2 w-2 rounded-sm" style={blueLineStyle} />
      <SliderDot {...{ onChange, sliderWidth, value, currentPosition, min, max }} />
    </View>
  )
}
