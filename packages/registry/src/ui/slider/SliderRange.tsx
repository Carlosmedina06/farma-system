import React, { useState } from 'react'
import { LayoutChangeEvent, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@farma/registry/lib/utils'

import { SliderDot } from './SliderDot'
import { RangeSliderProps, dotSize } from './Slider.types'

const AnimatedLine = Animated.createAnimatedComponent(View)

export const RangeSlider = ({
  value = { v1: 0, v2: 0 },
  max = 100,
  min = 0,
  onChange,
  className,
  testID,
  ...props
}: RangeSliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(0)
  const p1 = useSharedValue(value.v1)
  const p2 = useSharedValue(value.v2)

  const updateContainerWidth = (e: LayoutChangeEvent) => {
    setSliderWidth(e.nativeEvent.layout.width)
  }

  const blueLineStyle = useAnimatedStyle(() => {
    const pMin = Math.min(p1.value, p2.value)
    const pMax = Math.max(p1.value, p2.value)

    return {
      transform: [{ translateX: pMin + dotSize / 2 }],
      width: Math.abs(pMin - pMax),
    }
  })

  const onChangeV1 = (v1: number) => {
    onChange({ ...value, v1 })
  }

  const onChangeV2 = (v2: number) => {
    onChange({ ...value, v2 })
  }

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
      <SliderDot
        {...{ onChange: onChangeV1, sliderWidth, value: value.v1, currentPosition: p1, min, max }}
      />
      <SliderDot
        {...{ onChange: onChangeV2, sliderWidth, value: value.v2, currentPosition: p2, min, max }}
      />
    </View>
  )
}
