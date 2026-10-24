import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'

import { Toggle } from '../Toggle'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  const Animated = {
    View: AnimatedView,
    createAnimatedComponent: jest.fn((Component: any) => Component),
  }

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value: any) => value),
  }
})

describe('Toggle', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<Toggle testID="toggle" />)

    expect(getByTestId('toggle')).toBeTruthy()
  })

  it('should render with value true', () => {
    const { getByTestId } = render(<Toggle testID="toggle" value={true} />)

    expect(getByTestId('toggle')).toBeTruthy()
  })

  it('should render with value false', () => {
    const { getByTestId } = render(<Toggle testID="toggle" value={false} />)

    expect(getByTestId('toggle')).toBeTruthy()
  })

  it('should call onChange when pressed', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Toggle testID="toggle" value={false} onChange={mockOnChange} />)

    act(() => {
      fireEvent.press(getByTestId('toggle'))
    })

    expect(mockOnChange).toHaveBeenCalledWith(true)
  })

  it('should toggle value when pressed', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Toggle testID="toggle" value={true} onChange={mockOnChange} />)

    act(() => {
      fireEvent.press(getByTestId('toggle'))
    })

    expect(mockOnChange).toHaveBeenCalledWith(false)
  })

  it('should render with different sizes', () => {
    const sizes = ['xs', 'sm', 'md'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(<Toggle size={size} testID="toggle" />)

      expect(getByTestId('toggle')).toBeTruthy()
      unmount()
    })
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Toggle disabled testID="toggle" onChange={mockOnChange} />)

    act(() => {
      fireEvent.press(getByTestId('toggle'))
    })

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Toggle className="custom-class" testID="toggle" />)

    expect(getByTestId('toggle')).toBeTruthy()
  })
})
