export type Direction = 'right' | 'bottom'

export interface ProgressProps {
  progress: number
  direction?: Direction
  withLabel?: boolean
  className?: string
  testID?: string
}
