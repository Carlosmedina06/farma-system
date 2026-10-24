import { ViewProps } from 'react-native'

export const dotSize = 28

export interface SliderProps extends ViewProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  testID?: string
}

export interface Range {
  v1: number
  v2: number
}

export interface RangeSliderProps extends ViewProps {
  value: Range
  onChange: (value: Range) => void
  min?: number
  max?: number
  className?: string
  testID?: string
}

export const pointToValue = ({
  width = 0,
  min = 0,
  max = 0,
  point = 0,
}: {
  width?: number
  min?: number
  max?: number
  point?: number
}): number => min + (point / width) * max

export const valueToPoint = ({
  width = 0,
  min = 0,
  max = 0,
  value = 0,
}: {
  width?: number
  min?: number
  max?: number
  value?: number
}): number => (value / (max - min)) * width
