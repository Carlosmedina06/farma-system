export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioProps {
  size?: RadioSize
  selected?: boolean
  onPress?: () => void
  disabled?: boolean
  className?: string
  testID?: string
}
