import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'

import { Checkbox } from '../CheckBox'

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

jest.mock('@farma/registry/ui/check-icon', () => {
  const { View } = require('react-native')

  return {
    CheckboxCheckIcon: function CheckIconSvg(props: any) {
      return <View testID="check-icon-svg" {...props} />
    },
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name, testID, ...props }: any) {
      return <View testID={`icon-${name}`} {...props} />
    },
  }
})

jest.mock('@farma/registry/ui/radio', () => ({
  Radio: ({ selected, onPress, testID, ...props }: any) => {
    const React = require('react')
    const { Pressable, View } = require('react-native')

    return (
      <Pressable testID={testID} onPress={onPress} {...props}>
        <View testID="radio-inner">{selected ? 'Selected' : 'Not Selected'}</View>
      </Pressable>
    )
  },
}))

describe('Checkbox', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<Checkbox checked={false} testID="checkbox" />)

    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('should render with checked state', () => {
    const { getByTestId } = render(<Checkbox checked testID="checkbox" />)

    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('should call onChange when pressed', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Checkbox checked={false} testID="checkbox" onChange={mockOnChange} />,
    )

    act(() => {
      fireEvent.press(getByTestId('checkbox'))
    })

    expect(mockOnChange).toHaveBeenCalledWith(true)
  })

  it('should render with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(
        <Checkbox checked={false} size={size} testID="checkbox" />,
      )

      expect(getByTestId('checkbox')).toBeTruthy()
      unmount()
    })
  })

  it('should render with square shape', () => {
    const { getByTestId } = render(<Checkbox checked={false} shape="square" testID="checkbox" />)

    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('should render with circle shape', () => {
    const { getByTestId } = render(<Checkbox checked={false} shape="circle" testID="checkbox" />)

    // When shape is circle, the component uses Radio internally
    // The Radio component should be rendered
    expect(getByTestId('radio-inner')).toBeTruthy()
  })

  it('should render with minus state', () => {
    const { getByTestId } = render(<Checkbox minus checked={false} testID="checkbox" />)

    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Checkbox disabled checked={false} testID="checkbox" onChange={mockOnChange} />,
    )

    act(() => {
      fireEvent.press(getByTestId('checkbox'))
    })

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should render with SVG icon when useSvgIcon is true', () => {
    const { getByTestId } = render(<Checkbox useSvgIcon checked={true} testID="checkbox" />)

    expect(getByTestId('checkbox')).toBeTruthy()
    expect(getByTestId('check-icon-svg')).toBeTruthy()
  })

  it('should expose checkbox accessibility role and state by default', () => {
    const { getByTestId } = render(<Checkbox checked testID="checkbox" />)
    const checkbox = getByTestId('checkbox')

    expect(checkbox.props.accessibilityRole).toBe('checkbox')
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: true, disabled: false })
  })

  it('should omit accessibility role when accessible is false', () => {
    const { getByTestId } = render(<Checkbox accessible={false} checked={false} testID="checkbox" />)

    expect(getByTestId('checkbox').props.accessibilityRole).toBeUndefined()
  })

  it('should render the font check icon by default when checked', () => {
    const { getByTestId } = render(<Checkbox checked testID="checkbox" />)

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render the minus icon and mixed state when minus', () => {
    const { getByTestId } = render(<Checkbox minus checked={false} testID="checkbox" />)

    expect(getByTestId('icon-minus')).toBeTruthy()
    expect(getByTestId('checkbox').props.accessibilityState).toMatchObject({ checked: 'mixed' })
  })
})
