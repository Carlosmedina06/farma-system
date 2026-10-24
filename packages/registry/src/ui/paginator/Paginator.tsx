import type { SharedValue } from 'react-native-reanimated'

import React, { useMemo } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export type PaginatorProps = {
  pagesAmount: number
  currentPageIndex: SharedValue<number>
  visibleDots: number
  dotSize?: number
  spacing?: number
  background?: React.ReactNode
}

const SpringConfig = {
  damping: 15,
  stiffness: 100,
  mass: 0.5,
} as const

export const Paginator: React.FC<PaginatorProps> = React.memo(
  ({ pagesAmount, currentPageIndex, visibleDots, dotSize = 12, spacing = 8 }) => {
    // Create memoized array of dots to prevent unnecessary recreations
    const dots = useMemo(() => Array.from({ length: pagesAmount }, (_, i) => i), [pagesAmount])

    const visibleDotsIndices = useDerivedValue(() => {
      const currentIndex = Math.round(currentPageIndex.value)
      const halfVisible = Math.floor(visibleDots / 2)
      let start = Math.max(currentIndex - halfVisible, 0)
      const end = Math.min(start + visibleDots, pagesAmount)

      if (end === pagesAmount) {
        start = Math.max(pagesAmount - visibleDots, 0)
      }

      return { start, end, currentIndex }
    })

    const containerAnimatedStyle = useAnimatedStyle(() => {
      const { currentIndex } = visibleDotsIndices.value
      const dotFullWidth = dotSize * 2.5 // Maximum width of an active dot
      const regularDotWidth = dotSize
      const totalSpacing = spacing * (pagesAmount - 1)

      // Calculate the total width of all dots
      const totalWidth = (pagesAmount - 1) * regularDotWidth + dotFullWidth

      // Calculate the center position
      const centerOffset = (totalWidth + totalSpacing) / 2

      // Calculate the current position based on the current index
      const currentPosition = currentIndex * (regularDotWidth + spacing) + dotFullWidth / 2

      // Calculate the translation needed to center the current dot
      const translateX = centerOffset - currentPosition

      return {
        transform: [{ translateX: withSpring(translateX, SpringConfig) }],
      }
    })

    return (
      <View style={styles.paginatorContainer}>
        {pagesAmount > 1 && (
          <Animated.View style={[styles.dotsContainer, containerAnimatedStyle]}>
            {dots.map((dotIndex) => (
              <AnimatedDot
                key={`dot-${dotIndex}`}
                currentPageIndex={currentPageIndex}
                dotSize={dotSize}
                index={dotIndex}
                pagesAmount={pagesAmount}
                spacing={spacing}
                visibleDotsIndices={visibleDotsIndices}
              />
            ))}
          </Animated.View>
        )}
      </View>
    )
  },
)

Paginator.displayName = 'Paginator'

type AnimatedDotProps = {
  index: number
  visibleDotsIndices: SharedValue<{
    start: number
    end: number
    currentIndex: number
  }>
  spacing: number
  currentPageIndex: SharedValue<number>
  dotSize: number
  pagesAmount: number
}

const AnimatedDot = React.memo(
  ({
    index,
    visibleDotsIndices,
    spacing,
    currentPageIndex,
    dotSize,
    pagesAmount,
  }: AnimatedDotProps) => {
    const isVisible = useDerivedValue(() => {
      return index >= visibleDotsIndices.value.start && index < visibleDotsIndices.value.end
    })

    const visibility = useDerivedValue(() => {
      const isActive = currentPageIndex.value === index

      let opacity: number

      if (isActive) {
        opacity = 1
      } else {
        opacity = isVisible.value ? 0.75 : 0
      }

      return withTiming(opacity, {
        duration: 500,
        easing: Easing.linear,
      })
    }, [currentPageIndex, index])

    const rContainerStyle = useAnimatedStyle(() => {
      const isActive = currentPageIndex.value === index
      const { start, end } = visibleDotsIndices.value
      const isFirstVisible = index === start
      const isLastVisible = index === end - 1
      const isActualFirst = index === 0
      const isActualLast = index === pagesAmount - 1

      let scale = 1 // Default for active dot

      if ((isFirstVisible && !isActualFirst) || (isLastVisible && !isActualLast)) {
        scale = 0.6 // Smaller for visible extreme dots that are not actual extremes
      } else if (!isActive) {
        scale = 0.8 // Normal size for middle inactive dots and actual extremes
      }

      return {
        opacity: visibility.value,
        marginRight: spacing,
        transform: [{ scale: withSpring(scale, SpringConfig) }],
      }
    })

    const rDotStyle = useAnimatedStyle(() => {
      const isActive = currentPageIndex.value === index
      const backgroundColor = isActive ? '#007AFF' : 'rgba(0, 0, 0, 0.15)'

      return {
        width: dotSize,
        height: dotSize,
        backgroundColor: withTiming(backgroundColor, {
          duration: 300,
          easing: Easing.out(Easing.quad),
        }),
      }
    })

    return (
      <Animated.View style={rContainerStyle}>
        <Animated.View style={[styles.dot, rDotStyle]} />
      </Animated.View>
    )
  },
)

AnimatedDot.displayName = 'AnimatedDot'

const styles = StyleSheet.create({
  backgroundContainer: {
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  paginatorContainer: {
    width: '100%',
    height: 40,
    overflow: 'hidden',
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 9999,
  },
})
