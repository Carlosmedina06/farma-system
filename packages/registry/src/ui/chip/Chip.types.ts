export type ChipType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'tag'
  | 'primary'
  | 'gray'
  | 'selected'

export interface ChipProps {
  checked?: boolean
  selected?: boolean
  children?: string
  close?: boolean
  onPress?: () => void
  type?: ChipType
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  disabled?: boolean
  className?: string
  testID?: string
}

export const backgroundColorMapper: { [key in ChipType]: string } = {
  success: 'bg-success-100',
  error: 'bg-error-50',
  warning: 'bg-warning-100',
  info: 'bg-info-50',
  tag: 'bg-transparent',
  primary: 'bg-primary-50',
  gray: 'bg-gray-100',
  selected: 'bg-primary-100',
}

export const textColorMapper: { [key in ChipType]: string } = {
  success: 'text-success-900',
  error: 'text-error-600',
  warning: 'text-warning-900',
  info: 'text-info-600',
  tag: 'text-gray-600',
  primary: 'text-primary-600',
  gray: 'text-gray-900',
  selected: 'text-primary-900',
}

export const iconColorMapper: { [key: string]: string } = {
  selected: '#4955ec',
  default: '#475467',
}
