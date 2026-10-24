import type { ReactNode } from 'react'

import type { ButtonProps } from '@farma/registry/ui/button'
import type { FeaturedIconProps } from '@farma/registry/ui/featured-icon'

export type ModalOption = { label: string; value: string; otherText?: string }

/** Opción que, al elegirse, pide un texto libre (ej. "Otro"). */
export type FreeTextOption = {
  /** `value` de la opción que habilita el texto libre. */
  value: string
  minLength?: number
  maxLength?: number
  /** Mensaje cuando el texto es más corto que `minLength`. */
  errorText?: string
  placeholder?: string
}

export type OptionModalProps = {
  fullScreen?: boolean
  primaryAction?: Omit<ButtonProps, 'size'>
  secondaryAction?: Omit<ButtonProps, 'size'>
  title?: string
  description?: string
  preContent?: ReactNode
  icon?: FeaturedIconProps
  visible?: boolean
  options?: ModalOption[]
  freeTextOption?: FreeTextOption
  /** Selección controlada. Si no se pasa, el modal guarda la selección internamente. */
  selectedOption?: ModalOption
  onSelectOption?: (option: ModalOption | undefined) => void
  close?: () => void
  circumferenceColor?: string
  testID?: string
}
