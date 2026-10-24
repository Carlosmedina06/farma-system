import { ViewProps } from 'react-native'
import type { IconName } from '@farma/registry/ui/icon'

export type Size = 'sm' | 'md' | 'lg'

export interface TagProps extends ViewProps {
  checked?: boolean
  icon?: {
    name: IconName
    color: string
    size?: number
  }
  size?: Size
  counter?: number
  text?: string
  onClose?: () => void
  className?: string
  testID?: string
}

export const iconSize: { [key in Size]: number } = {
  sm: 10,
  md: 12,
  lg: 14,
}
