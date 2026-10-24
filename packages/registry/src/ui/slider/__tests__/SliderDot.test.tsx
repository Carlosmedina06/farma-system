import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { SliderDot } from '../SliderDot'

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
    withTiming: jest.fn((value: any) => value),
    clamp: jest.fn((value: any, min: any, max: any) => Math.max(min, Math.min(max, value))),
    runOnJS: jest.fn((fn: any) => fn),
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

describe('SliderDot', () => {
  const mockCurrentPosition = { value: 0 } as any
  const mockOnChange = jest.fn()

  it('should render with required props', () => {
    const { UNSAFE_root } = render(
      <SliderDot
        currentPosition={mockCurrentPosition}
        max={100}
        min={0}
        sliderWidth={200}
        value={50}
        onChange={mockOnChange}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should render with different values', () => {
    const { UNSAFE_root } = render(
      <SliderDot
        currentPosition={mockCurrentPosition}
        max={100}
        min={0}
        sliderWidth={200}
        value={25}
        onChange={mockOnChange}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('should render with different min and max', () => {
    const { UNSAFE_root } = render(
      <SliderDot
        currentPosition={mockCurrentPosition}
        max={200}
        min={10}
        sliderWidth={300}
        value={50}
        onChange={mockOnChange}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })
})
