import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { tv } from 'tailwind-variants'

import { cn } from '@farma/registry/lib/utils'

import { ToggleProps, containersWidths, dotSize, Size } from './Toggle.types'

const getDotTranslate = (size: Size, value: boolean): number => {
  if (!value) {
    return 0
  }

  return containersWidths[size] - dotSize[size] - 4
}

const containerVariants = tv({
  base: 'items-center p-0.5 flex-row rounded-md max-h-8',
  variants: {
    value: {
      true: 'bg-primary-600',
      false: 'bg-gray-400',
    },
    disabled: {
      true: 'bg-gray-100',
      false: '',
    },
  },
  compoundVariants: [
    {
      value: true,
      disabled: true,
      className: 'bg-gray-100',
    },
  ],
})

const getContainerWidth = (size: Size): number => containersWidths[size]

const getDotDimensions = (size: Size): { width: number; height: number } => ({
  width: dotSize[size],
  height: dotSize[size],
})

const AnimatedView = Animated.createAnimatedComponent(View)

export const Toggle: React.FC<ToggleProps> = ({
  onChange,
  disabled = false,
  value = false,
  size = 'sm',
  className,
  testID,
}) => {
  const translateX = useSharedValue(0)
  const containerWidth = getContainerWidth(size)
  const dotDimensions = getDotDimensions(size)

  useEffect(() => {
    const targetTranslateX = getDotTranslate(size, value)

    translateX.value = withTiming(targetTranslateX, { duration: 200 })
  }, [value, size, translateX])

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const containerStyle = {
    width: containerWidth,
  }

  const dotStyle = {
    width: dotDimensions.width,
    height: dotDimensions.height,
  }

  const shadowStyle = disabled
    ? {}
    : {
        shadowColor: 'rgba(16, 24, 40, 1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.26,
        shadowRadius: 2,
        elevation: 2,
      }

  return (
    <Pressable
      className={cn(containerVariants({ value: !disabled && value, disabled }), className)}
      disabled={disabled}
      style={containerStyle}
      testID={testID}
      onPress={() => onChange?.(!value)}
    >
      <AnimatedView
        className="bg-base-white rounded-lg"
        style={[dotStyle, shadowStyle, animatedDotStyle]}
      />
    </Pressable>
  )
}
