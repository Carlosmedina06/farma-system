import type { ReactNode } from 'react'
import type { IconName } from '@farma/registry/ui/icon'
import type { TextProps } from '@farma/registry/ui/text'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'textLink'
  | 'textLinkWhite'
  | 'tertiaryGray'
  | 'tertiaryGraySquare'
  | 'secondaryGray'
  /** Botón blanco con borde gris (login social: Google, Apple…). */
  | 'socialButton'

export type TextAlign = 'center' | 'left' | 'right'

export interface ButtonProps {
  disabled?: boolean
  icon?: IconName
  iconRightSide?: boolean
  children?: ReactNode
  size?: ButtonSize
  type?: ButtonType
  full?: boolean
  textAlign?: TextAlign
  onPress?: () => void
  color?: string
  loading?: boolean
  className?: string
  testID?: string
}

export type ButtonOnlyProps = Omit<ButtonProps, 'iconRightSide' | 'children'>

export const iconSizeMapper: { [key in ButtonSize]: number } = {
  xs: 16,
  sm: 20,
  md: 20,
  lg: 20,
  xl: 20,
  '2xl': 24,
}

export const textSizeMapper: { [key in ButtonSize]: TextProps['type'] } = {
  xs: 'caption',
  sm: 'body2',
  md: 'body2',
  lg: 'body1',
  xl: 'body1',
  '2xl': 'h3',
}

export const textColorMapper: { [key: string]: string } = {
  primary: 'text-base-white',
  primaryPressed: 'text-base-white',
  primaryDisabled: 'text-gray-200',

  secondary: 'text-primary-600',
  secondaryPressed: 'text-primary-800',
  secondaryDisabled: 'text-gray-400',

  tertiary: 'text-primary-600',
  tertiaryPressed: 'text-primary-800',
  tertiaryDisabled: 'text-gray-400',

  textLink: 'text-primary-600',
  textLinkPressed: 'text-primary-800',
  textLinkDisabled: 'text-gray-400',

  textLinkWhite: 'text-base-white',
  textLinkWhitePressed: 'text-gray-100',
  textLinkWhiteDisabled: 'text-gray-400',

  tertiaryGray: 'text-gray-600',

  secondaryGray: 'text-primary-600',
  secondaryGrayPressed: 'text-primary-800',
  secondaryGrayDisabled: 'text-gray-200',

  socialButton: 'text-gray-700',
  socialButtonPressed: 'text-gray-800',
  socialButtonDisabled: 'text-gray-400',
}

export const iconColorMapper: { [key: string]: string } = {
  primary: '#ffffff',
  primaryPressed: '#ffffff',
  primaryDisabled: '#ffffff',

  secondary: '#4955ec',
  secondaryPressed: '#1d2f9d',
  secondaryDisabled: '#98a2b3',

  tertiary: '#4955ec',
  tertiaryPressed: '#1d2f9d',
  tertiaryDisabled: '#98a2b3',

  textLink: '#4955ec',
  textLinkPressed: '#1d2f9d',
  textLinkDisabled: '#98a2b3',

  textLinkWhite: '#ffffff',
  textLinkWhitePressed: '#f2f4f7',
  textLinkWhiteDisabled: '#98a2b3',

  tertiaryGray: '#475467',

  secondaryGray: '#4955ec',
  secondaryGrayPressed: '#1d2f9d',
  secondaryGrayDisabled: '#98a2b3',

  socialButton: '#344054',
  socialButtonPressed: '#1d2939',
  socialButtonDisabled: '#98a2b3',
}

export const backgroundColorMapper: { [key: string]: string } = {
  primary: 'bg-primary-600',
  primaryPressed: 'bg-primary-800',
  primaryDisabled: 'bg-gray-500',

  secondaryDisabled: 'bg-gray-400',
  secondaryPressed: 'bg-primary-25',

  tertiaryPressed: 'bg-primary-50',
  tertiaryGraySquarePressed: 'bg-gray-50',

  secondaryGray: 'bg-primary-50',
  secondaryGrayDisabled: 'bg-gray-400',
  secondaryGrayPressed: 'bg-primary-25',

  socialButton: 'bg-base-white',
  socialButtonPressed: 'bg-gray-50',
  socialButtonDisabled: 'bg-base-white',
}

export const borderColorMapper: { [key: string]: string } = {
  socialButton: 'border-gray-300',
  socialButtonPressed: 'border-gray-300',
  socialButtonDisabled: 'border-gray-300',
  secondary: 'border-primary-600',
  secondaryPressed: 'border-primary-800',
  secondaryDisabled: 'border-gray-300',

  tertiaryGray: 'border-gray-300',
  tertiaryGraySquare: 'border-gray-300',

  secondaryGray: 'border-primary-50',
}

export const borderWidthMapper: { [key: string]: string } = {
  secondary: 'border-1',
  secondaryPressed: 'border-1',
  secondaryDisabled: 'border-1',
  tertiaryGraySquare: 'border',
  tertiaryGray: 'border-2',
  socialButton: 'border',
  socialButtonPressed: 'border',
  socialButtonDisabled: 'border',
}

export const getType = (type: ButtonType, disabled?: boolean, pressed?: boolean) =>
  `${type}${disabled ? 'Disabled' : ''}${pressed ? 'Pressed' : ''}`

type JustifyContent = 'flex-start' | 'center' | 'flex-end'

export const textAlignMapper: { [key in TextAlign]: JustifyContent } = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
}
