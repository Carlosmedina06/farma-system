import { AccessibilityProps } from 'react-native'

export type Size = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends AccessibilityProps {
  onChange?: (checked: boolean) => void
  disabled?: boolean
  checked: boolean
  appearance?: 'primary' | 'neutral'
  size?: Size
  minus?: boolean
  className?: string
  shape?: 'square' | 'circle'
  useSvgIcon?: boolean
  testID?: string
}

export const containersWidths: { [key in Size]: number } = {
  sm: 20,
  md: 24,
  lg: 24,
}

export const iconSize: { [key in Size]: number } = {
  sm: 12,
  md: 17,
  lg: 24,
}

export const getBorderRadius = (shape: 'circle' | 'square', size: Size): number => {
  if (shape === 'circle') {
    return 9999
  }

  switch (size) {
    case 'sm':
      return 6
    case 'md':
      return 8
    case 'lg':
      return 8
    default:
      return 6
  }
}
