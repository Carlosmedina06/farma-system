import type { Ref } from 'react'
import { TextInputProps, type TextInputInstance } from 'react-native'
import { MaskedTextInputProps } from 'react-native-mask-text'

import type { IconName } from '@farma/registry/ui/icon'

export interface InputIcon {
  name: IconName
  color?: string
  size?: number
  position?: 'left' | 'right'
  onPress?: () => void
}

export interface InputProps extends TextInputProps {
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  filled?: boolean
  helperText?: string
  icon?: InputIcon
  label?: string
  placeholder?: string
  rounded?: boolean
  inputRef?: Ref<TextInputInstance | null>
  maskPattern?: string
  maskOptions?: MaskedTextInputProps['options']
  maskType?: MaskedTextInputProps['type']
  onChangeText?: (text: string, unmaskedText?: string) => void
  customPaddingVertical?: number
  maxLength?: number
  className?: string
  inputClassName?: string
  testID?: string
}

export enum Variants {
  Disabled = 'disabled',
  FocusError = 'focusError',
  Focus = 'focus',
  FilledError = 'filledError',
  Filled = 'filled',
  Error = 'error',
  Default = 'default',
}

interface getVariantsProps {
  disabled: boolean
  focus: boolean
  error: boolean
  filled: boolean
}

export const getInputVariants = ({
  disabled,
  focus,
  error,
  filled,
}: getVariantsProps): Variants => {
  const conditions = {
    [Variants.Disabled]: disabled,
    [Variants.FocusError]: focus && error,
    [Variants.Focus]: focus && !error,
    [Variants.FilledError]: filled && error && !focus,
    [Variants.Filled]: filled && !error,
    [Variants.Error]: !filled && error,
  }

  return (
    (Object.keys(conditions).find(
      (key) => conditions[key as keyof typeof conditions],
    ) as Variants) || Variants.Default
  )
}
