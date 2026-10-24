import { ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

export type AnimatedEffect = 'linear' | 'fade' | 'fadeUp' | 'fadeDown'

export interface AnimatedLayoutProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  effect?: AnimatedEffect
  animateLayout?: boolean
  className?: string
  testID?: string
}
