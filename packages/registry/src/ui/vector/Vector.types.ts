import { ViewProps } from 'react-native'

export interface VectorProps extends ViewProps {
  strokeColor?: string
  height?: number
  strokeWidth?: number
  className?: string
  testID?: string
}
