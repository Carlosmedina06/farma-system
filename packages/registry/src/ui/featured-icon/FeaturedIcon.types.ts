import type { IconName } from '@farma/registry/ui/icon'

export type FeaturedIconType = 'success-green' | 'info' | 'gray' | 'success' | 'error' | 'warning'

export interface FeaturedIconProps {
  icon: IconName
  type?: FeaturedIconType
  outline?: boolean
  className?: string
  testID?: string
}

export const size = 22 + 14 * 2 + 5 * 2
export const outlineBorder = 10

export const circleBackgroundMapper: { [key in FeaturedIconType]: string } = {
  info: 'bg-primary-100',
  gray: 'bg-gray-200',
  success: 'bg-primary-100',
  error: 'bg-error-100',
  warning: 'bg-warning-100',
  'success-green': 'bg-success-100',
}

export const circleBorderMapper: { [key in FeaturedIconType]: string } = {
  info: 'border-primary-25',
  gray: 'border-gray-50',
  success: 'border-primary-25',
  error: 'border-error-50',
  warning: 'border-warning-50',
  'success-green': 'border-success-50',
}

export const iconColorMapper: { [key in FeaturedIconType]: string } = {
  info: '#4955ec',
  gray: '#475467',
  success: '#4955ec',
  error: '#b61f29',
  warning: '#dc6803',
  'success-green': '#027a48',
}
