import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { RangeSlider } from '../SliderRange'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  return {
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: any) => Component,
    },
    View: AnimatedView,
    createAnimatedComponent: jest.fn((Component: any) => Component),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
  }
})

jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: jest.fn(() => ({
      onUpdate: jest.fn(() => ({
        onEnd: jest.fn(() => ({})),
      })),
      onEnd: jest.fn(() => ({})),
    })),
  },
  GestureDetector: ({ children }: any) => children,
}))

jest.mock('../SliderDot', () => ({
  SliderDot: (props: any) => {
    const React = require('react')
    const { View } = require('react-native')

    return <View testID="slider-dot" {...props} />
  },
}))

describe('RangeSlider', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(
      <RangeSlider testID="range-slider" value={{ v1: 0, v2: 0 }} onChange={jest.fn()} />,
    )

    expect(getByTestId('range-slider')).toBeTruthy()
  })

  it('should render with value range', () => {
    const { getByTestId } = render(
      <RangeSlider testID="range-slider" value={{ v1: 20, v2: 80 }} onChange={jest.fn()} />,
    )

    expect(getByTestId('range-slider')).toBeTruthy()
  })

  it('should render with min and max', () => {
    const { getByTestId } = render(
      <RangeSlider
        max={200}
        min={0}
        testID="range-slider"
        value={{ v1: 10, v2: 90 }}
        onChange={jest.fn()}
      />,
    )

    expect(getByTestId('range-slider')).toBeTruthy()
  })

  it('should call onChange when values change', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <RangeSlider testID="range-slider" value={{ v1: 25, v2: 75 }} onChange={mockOnChange} />,
    )

    expect(getByTestId('range-slider')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <RangeSlider
        className="custom-class"
        testID="range-slider"
        value={{ v1: 0, v2: 0 }}
        onChange={jest.fn()}
      />,
    )

    expect(getByTestId('range-slider')).toBeTruthy()
  })
})
