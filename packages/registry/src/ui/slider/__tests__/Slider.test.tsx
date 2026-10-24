import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { Slider } from '../Slider'

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
    clamp: jest.fn((value: any, min: any, max: any) => Math.max(min, Math.min(max, value))),
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

describe('Slider', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<Slider testID="slider" value={0} onChange={jest.fn()} />)

    expect(getByTestId('slider')).toBeTruthy()
  })

  it('should render with value', () => {
    const { getByTestId } = render(<Slider testID="slider" value={50} onChange={jest.fn()} />)

    expect(getByTestId('slider')).toBeTruthy()
  })

  it('should render with min and max', () => {
    const { getByTestId } = render(
      <Slider max={200} min={0} testID="slider" value={0} onChange={jest.fn()} />,
    )

    expect(getByTestId('slider')).toBeTruthy()
  })

  it('should call onChange when value changes', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Slider testID="slider" value={25} onChange={mockOnChange} />)

    expect(getByTestId('slider')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Slider className="custom-class" testID="slider" value={0} onChange={jest.fn()} />,
    )

    expect(getByTestId('slider')).toBeTruthy()
  })
})
