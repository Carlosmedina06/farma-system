export type Size = 'xs' | 'sm' | 'md'

export interface ToggleProps {
  size?: Size
  disabled?: boolean
  value?: boolean
  onChange?: (value: boolean) => void
  className?: string
  testID?: string
}

export const containersWidths: { [key in Size]: number } = {
  md: 28,
  sm: 36,
  xs: 44,
}

export const dotSize: { [key in Size]: number } = {
  md: 12,
  sm: 16,
  xs: 20,
}
