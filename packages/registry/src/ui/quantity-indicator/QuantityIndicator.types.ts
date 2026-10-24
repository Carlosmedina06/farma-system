import { ViewProps } from 'react-native'

export interface QuantityIndicatorProps extends ViewProps {
  quantity: number
  onPress?: () => void
  className?: string
  testID?: string
}
