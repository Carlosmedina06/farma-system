import type { StyleProp, ViewStyle } from 'react-native'
import type { IconName } from '@farma/registry/ui/icon'

export type DotsDropdownOption = {
  label: string
  icon?: IconName
  onPress: () => void
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

/** Alias de compatibilidad con el nombre original en app-mobile. */
export type Option = DotsDropdownOption

export type DotsDropdownProps = {
  pressDots?: () => void
  options: DotsDropdownOption[]
  style?: StyleProp<ViewStyle>
  iconColor?: string
  position?: 'left' | 'right' | 'center'
  bottomBoundaryOffset?: number
  className?: string
  testID?: string
  /** Default "Más opciones". */
  accessibilityLabel?: string
  accessibilityHint?: string
  /** Si se pasa, el menú es controlado. */
  isOpen?: boolean
}
