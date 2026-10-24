import { AccessibilityProps, ViewProps } from 'react-native'
import type { FeaturedIconProps } from '@farma/registry/ui/featured-icon'
import type { ButtonProps } from '@farma/registry/ui/button'
import type { ButtonSectionVariant } from '@farma/registry/ui/button-section-layout'

export type ModalActionProps = Omit<ButtonProps, 'size'> & AccessibilityProps

export type ModalProps = ViewProps & {
  isCompactModal?: boolean
  isSuccess?: boolean
  fullScreen?: boolean
  feedback?: boolean
  primaryAction?: ModalActionProps
  secondaryAction?: ModalActionProps
  title?: string
  primaryActionButtonType?: 'primary' | 'secondary'
  description?: string
  secondaryDescription?: string
  formattedDescription?: React.ReactNode
  preContent?: React.ReactNode
  icon?: FeaturedIconProps
  visible?: boolean
  close?: () => void
  customClose?: () => void
  circumferenceColor?: string
  textSpacing?: boolean
  variant?: ButtonSectionVariant
  topColor?: string
  preContentDistance?: number
  isLoading?: boolean
  showBackIcon?: boolean
  className?: string
  testID?: string
  hideCloseButton?: boolean
  // Skips the fullScreen modal's fade-in/out. Use when something that
  // changes what's mounted behind it (e.g. a navigation stack swap) happens
  // in the same synchronous handler right before showModal — otherwise that
  // change paints instantly while the modal is still fading in from
  // transparent, so it's briefly visible through it.
  instant?: boolean
}
