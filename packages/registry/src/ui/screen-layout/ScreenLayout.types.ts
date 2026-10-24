import type { ReactNode } from 'react'
import type { StyleProp, ViewProps, ViewStyle } from 'react-native'
import type { Edge } from 'react-native-safe-area-context'

export const NAVIGATION_HEADER_EDGES: Edge[] = ['bottom', 'left', 'right']
export const FULL_SCREEN_EDGES: Edge[] = ['top', 'bottom', 'left', 'right']

export type ScreenLayoutProps = ViewProps & {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
  backgroundClassName?: string
  testID?: string
  edges?: Edge[]
}
