import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'

import { Radio } from '../Radio'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  return {
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((value: any) => value),
    interpolate: jest.fn((value: any, inputRange: any, outputRange: any) => {
      if (value === 0) return outputRange[0]

      return outputRange[1]
    }),
  }
})

describe('Radio', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<Radio testID="radio" />)

    expect(getByTestId('radio')).toBeTruthy()
  })

  it('should render with selected state', () => {
    const { getByTestId } = render(<Radio selected testID="radio" />)

    expect(getByTestId('radio')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(<Radio testID="radio" onPress={mockOnPress} />)

    act(() => {
      fireEvent.press(getByTestId('radio'))
    })

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(<Radio size={size} testID="radio" />)

      expect(getByTestId('radio')).toBeTruthy()
      unmount()
    })
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(<Radio disabled testID="radio" onPress={mockOnPress} />)

    act(() => {
      fireEvent.press(getByTestId('radio'))
    })

    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Radio className="custom-class" testID="radio" />)

    expect(getByTestId('radio')).toBeTruthy()
  })
})
