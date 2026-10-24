import type { ViewProps } from 'react-native'
import type { IconName } from '@farma/registry/ui/icon'

export interface HeaderWithSeeMoreProps extends ViewProps {
  title: string
  seeMoreText?: string
  /** Default `chevron-right`. */
  icon?: IconName
  onPress?: () => void
  className?: string
  testID?: string
  seeMoreTestID?: string
}
