import { TextInputProps } from 'react-native'

export interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value?: string
  /** Recibe solo dígitos (máx. 10). */
  onChangeText?: (text: string) => void
  error?: boolean
  errorMessage?: string
  /** Por defecto "Número de teléfono". */
  label?: string
  /** Por defecto "Código de área + número.". */
  helperText?: string
  /** Por defecto "+54 9". */
  countryCode?: string
  /** Por defecto "11 1234 5678". */
  placeholder?: string
  onFocus?: () => void
  onBlur?: () => void
  isValid?: boolean
  testID?: string
}
