import type { IconName } from '@farma/registry/ui/icon'

export interface BadgeProps {
  color: ColorName
  children: string
  size: SizeProp
  icon?: IconName
  iconRightSide?: boolean
  iconSize?: number
  iconClassName?: string
  radius?: RadiusName
  className?: string
  testID?: string
  textType?: 'body1' | 'body2' | 'caption'
  /** Texto en semibold. */
  semibold?: boolean
}

export type RadiusName = 's' | 'lg'

export type ColorName =
  | 'gray'
  | 'primary'
  | 'error'
  | 'warning'
  | 'success'
  | 'blue'
  | 'blue-gray'
  | 'blue-light'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'rose'
  | 'orange'
  | 'info'
  | 'tertiary'

export type Size =
  | 'xs'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xsIconLeft'
  | 'xsIconRight'
  | 'smIconLeft'
  | 'smIconRight'
  | 'mdIconLeft'
  | 'mdIconRight'
  | 'lgIconLeft'
  | 'lgIconRight'
  /** Padding horizontal amplio (px-md). */
  | 'wide'
  | 'wideIconLeft'
  | 'wideIconRight'

export type SizeProp = Exclude<
  Size,
  | 'xsIconLeft'
  | 'xsIconRight'
  | 'smIconLeft'
  | 'smIconRight'
  | 'mdIconLeft'
  | 'mdIconRight'
  | 'lgIconLeft'
  | 'lgIconRight'
  | 'wideIconLeft'
  | 'wideIconRight'
>

export const backgroundMapper: { [key: string]: string } = {
  gray: 'bg-gray-100',
  primary: 'bg-primary-100',
  error: 'bg-error-100',
  warning: 'bg-warning-100',
  success: 'bg-success-100',
  'blue-gray': 'bg-grayBlue-50',
  'blue-light': 'bg-blueLight-50',
  blue: 'bg-blue-50',
  indigo: 'bg-indigo-50',
  purple: 'bg-purple-50',
  pink: 'bg-pink-50',
  rose: 'bg-rose-50',
  orange: 'bg-orange-50',
  info: 'bg-info-100',
  tertiary: 'bg-tertiary-100',
}

export const textColorMapper: { [key: string]: string } = {
  gray: 'text-gray-900',
  primary: 'text-primary-900',
  error: 'text-error-900',
  warning: 'text-warning-900',
  success: 'text-success-900',
  'blue-gray': 'text-grayBlue-600',
  'blue-light': 'text-blueLight-600',
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
  purple: 'text-purple-600',
  pink: 'text-pink-600',
  rose: 'text-rose-600',
  orange: 'text-orange-600',
  info: 'text-info-900',
  tertiary: 'text-tertiary-900',
}

export const iconColorMapper: { [key: string]: string } = {
  gray: '#101828',
  primary: '#00156f',
  error: '#500006',
  warning: '#7a2e0e',
  success: '#003620',
  'blue-gray': '#3e4784',
  'blue-light': '#0086c9',
  blue: '#1570ef',
  indigo: '#444ce7',
  purple: '#6938ef',
  pink: '#dd2590',
  rose: '#e31b54',
  orange: '#e04f16',
  info: '#004a60',
  tertiary: '#39006e',
}

export const iconSizeMapper: { [key in SizeProp]: number } = {
  xs: 10,
  sm: 12,
  md: 12,
  lg: 12,
  wide: 12,
}

export const textSizeMapper: { [key in SizeProp]: 'body1' | 'body2' | 'caption' } = {
  xs: 'caption',
  sm: 'body2',
  md: 'body1',
  lg: 'body2',
  wide: 'body2',
}

export const sizeMapper = (size: SizeProp, icon?: IconName, iconRightSide?: boolean): Size => {
  if (!iconRightSide && icon) return `${size}IconLeft`
  if (iconRightSide && icon) return `${size}IconRight`

  return size
}
