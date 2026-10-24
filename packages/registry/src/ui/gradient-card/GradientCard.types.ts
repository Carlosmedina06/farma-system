import type { ReactNode } from 'react'
import type { ColorValue, DimensionValue, ViewProps } from 'react-native'

export interface GradientCardProps extends ViewProps {
  children: ReactNode
  width?: DimensionValue
  minHeight?: DimensionValue
  /** Default `['#FFFFFF', '#98DAF1', '#98DAF1']` (horizontal). */
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]]
  onPress?: () => void
  className?: string
  testID?: string
}
