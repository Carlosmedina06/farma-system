import { TextInputProps, type TextInputInstance } from 'react-native'
import { RefObject } from 'react'

export interface SearchProps extends TextInputProps {
  disabled?: boolean
  onChangeText?: (text: string) => void
  /** Por defecto "Buscar". */
  placeholder?: string
  inputRef?: RefObject<TextInputInstance | null>
  onClear?: () => void
  onSearch?: () => void
  keepPlaceholderOnFocus?: boolean
  clearTestID?: string
  /** Por defecto "Borrar búsqueda". */
  clearAccessibilityLabel?: string
  clearAccessibilityHint?: string
}

export enum Variants {
  Placeholder = 'placeholder',
  Disabled = 'disabled',
  Focus = 'focus',
  Default = 'default',
}

interface GetVariantsProps {
  disabled: boolean
  focus: boolean
  filled: boolean
}

export const getInputVariants = ({ disabled, focus, filled }: GetVariantsProps): Variants => {
  const conditions = {
    [Variants.Focus]: focus,
    [Variants.Disabled]: disabled,
    [Variants.Placeholder]: !focus && !filled,
  }

  return (
    (Object.keys(conditions).find(
      (key) => conditions[key as keyof typeof conditions],
    ) as Variants) || Variants.Default
  )
}
