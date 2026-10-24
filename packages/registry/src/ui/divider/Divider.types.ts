export enum DividerType {
  Text = 'text',
  Line = 'line',
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'

export const dividerSizes: { [key in Size]: number } = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
}

export interface DividerProps {
  type?: 'text' | 'line'
  size: Size
  label?: string
  color?: string
  className?: string
  testID?: string
}
