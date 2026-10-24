export interface DropDownButtonProps {
  label?: string
  /** Texto que se muestra cuando no hay `value` (placeholder). */
  text: string
  value?: string
  /** Formatea `value` antes de mostrarlo. Por defecto lo muestra tal cual. */
  formatValue?: (value: string) => string
  disabled?: boolean
  onPress?: () => void
  small?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
  testID?: string
}
