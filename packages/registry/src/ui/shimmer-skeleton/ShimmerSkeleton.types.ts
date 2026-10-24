import type { DimensionValue, ViewProps } from 'react-native'

export type ShimmerColorMode = 'light' | 'dark'

export interface ShimmerSkeletonProps extends Omit<ViewProps, 'style'> {
  height: DimensionValue
  width: DimensionValue
  radius?: number
  colorMode?: ShimmerColorMode
  /** Overrides default shimmer gradient (3 stops). */
  gradientColors?: readonly [string, string, string]
  className?: string
  testID?: string
  style?: ViewProps['style']
}
