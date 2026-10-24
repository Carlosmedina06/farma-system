export interface CounterProps {
  max?: number
  value?: number
  onChange?: (value: number) => void
  onIncrement?: () => void
  onDecrement?: () => void
  onRemove?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
  testID?: string
}
