import type { AnimationObject } from 'lottie-react-native'

import spinnerBlue from '@farma/assets/animations/spinner-blue.json'

export type Colors = 'blue'
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

export interface SpinnerProps {
  size?: SpinnerSize | number
  color?: Colors
  className?: string
  testID?: string
  position?: 'absolute' | 'relative'
}

export const sizeMapper: { [key in SpinnerSize]: number } = {
  xs: 16,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
}

export const spinnerColor: { [key in Colors]: AnimationObject } = {
  blue: spinnerBlue as AnimationObject,
}
