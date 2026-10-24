import type { ShimmerSkeletonProps } from './ShimmerSkeleton.types'

import { memo, useCallback } from 'react'
import { LayoutChangeEvent, StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

import { cn } from '@farma/registry/lib/utils'
import { UniwindLinearGradient } from '@farma/registry/ui/linear-gradient'

import { useShimmerProgress } from './ShimmerSkeletonProvider'

const LIGHT = {
  track: '#E8EEF2',
  colors: ['#E1E8EE', '#F4F7FA', '#E1E8EE'] as const,
}

const DARK = {
  track: '#2A2A2A',
  colors: ['#252525', '#3A3A3A', '#252525'] as const,
}

function ShimmerSkeleton({
  height,
  width,
  radius = 4,
  colorMode = 'light',
  gradientColors: gradientColorsProp,
  className,
  testID,
  style,
  ...rest
}: ShimmerSkeletonProps) {
  const progress = useShimmerProgress()
  const layoutW = useSharedValue(0)

  const palette = colorMode === 'dark' ? DARK : LIGHT
  const gradientColors = gradientColorsProp ?? palette.colors
  const trackColor = gradientColorsProp?.[0] ?? palette.track

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      layoutW.value = e.nativeEvent.layout.width
    },
    [layoutW],
  )

  const animatedStyle = useAnimatedStyle(() => {
    const w = Math.max(layoutW.value, 1)
    const travel = w * 1.6
    const x = interpolate(progress.value, [0, 1], [-travel, travel])

    return {
      transform: [{ translateX: x }],
    }
  })

  const gradientStripStyle = useAnimatedStyle(() => {
    const w = Math.max(layoutW.value, 80)

    return {
      width: w * 2.2,
      height: '100%' as const,
    }
  }, [])

  return (
    <View
      className={cn('overflow-hidden bg-transparent', className)}
      style={[{ height, width, borderRadius: radius, backgroundColor: trackColor }, style]}
      testID={testID}
      onLayout={onLayout}
      {...rest}
    >
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, animatedStyle]}>
          <Animated.View style={gradientStripStyle}>
            <UniwindLinearGradient
              colors={[...gradientColors]}
              end={{ x: 1, y: 0.5 }}
              start={{ x: 0, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
      </Animated.View>
    </View>
  )
}

export default memo(ShimmerSkeleton)
