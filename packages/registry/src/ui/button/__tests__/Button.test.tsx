import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Button } from '../Button'

jest.mock('@farma/registry/ui/spinner', () => ({
  Spinner: (props: any) => {
    const React = require('react')
    const { View } = require('react-native')

    return <View testID="spinner" {...props} />
  },
}))

jest.mock('@farma/registry/ui/icon', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function MockIcon({ name, testID, ...props }: any) {
    return <View testID={`icon-${name}`} {...props} />
  }
})()
  return { Icon: mod?.default ?? mod }
})

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, ...props }: any) {
    return <Text {...props}>{children}</Text>
  }
})()
  return { Text: mod?.default ?? mod }
})

describe('Button', () => {
  it('should render with children', () => {
    const { getByText, getByTestId } = render(
      <Button testID="button" onPress={jest.fn()}>
        Click me
      </Button>,
    )

    expect(getByTestId('button')).toBeTruthy()
    expect(getByText('Click me')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <Button testID="button" onPress={mockOnPress}>
        Click me
      </Button>,
    )

    fireEvent.press(getByTestId('button'))

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with loading state', () => {
    const { getByTestId } = render(
      <Button loading testID="button" onPress={jest.fn()}>
        Loading
      </Button>,
    )

    expect(getByTestId('button-spinner')).toBeTruthy()
  })

  it('should render with icon', () => {
    const { getByTestId } = render(
      <Button icon="check" testID="button" onPress={jest.fn()}>
        Button
      </Button>,
    )

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render with icon on right side', () => {
    const { getByTestId } = render(
      <Button iconRightSide icon="chevron-right" testID="button" onPress={jest.fn()}>
        Button
      </Button>,
    )

    expect(getByTestId('icon-chevron-right')).toBeTruthy()
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <Button disabled testID="button" onPress={mockOnPress}>
        Disabled
      </Button>,
    )

    fireEvent.press(getByTestId('button'))

    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should render with different types', () => {
    const types = [
      'primary',
      'secondary',
      'tertiary',
      'textLink',
      'textLinkWhite',
      'tertiaryGray',
      'tertiaryGraySquare',
      'secondaryGray',
      'socialButton',
    ] as const

    types.forEach((type) => {
      const { getByTestId, unmount } = render(
        <Button testID="button" type={type} onPress={jest.fn()}>
          Button
        </Button>,
      )

      expect(getByTestId('button')).toBeTruthy()
      unmount()
    })
  })

  it('should render with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(
        <Button size={size} testID="button" onPress={jest.fn()}>
          Button
        </Button>,
      )

      expect(getByTestId('button')).toBeTruthy()
      unmount()
    })
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Button className="custom-class" testID="button" onPress={jest.fn()}>
        Button
      </Button>,
    )

    expect(getByTestId('button')).toBeTruthy()
  })

  it('should apply socialButton border classes', () => {
    const { getByTestId } = render(
      <Button testID="button" type="socialButton">
        Google
      </Button>,
    )

    expect(getByTestId('button').props.className).toContain('border-gray-300')
  })

  it('should move text-* classes from className to the label', () => {
    const { getByText } = render(
      <Button className="mt-2 text-error-600" testID="button">
        Rojo
      </Button>,
    )

    expect(getByText('Rojo').props.className).toContain('text-error-600')
  })
})
