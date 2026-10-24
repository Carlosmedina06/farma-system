import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { ButtonOnly } from '../ButtonOnly'

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

describe('ButtonOnly', () => {
  it('should render with default props', () => {
    const { getByTestId } = render(<ButtonOnly testID="button-only" onPress={jest.fn()} />)

    expect(getByTestId('button-only')).toBeTruthy()
    expect(getByTestId('icon-plus')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(<ButtonOnly testID="button-only" onPress={mockOnPress} />)

    fireEvent.press(getByTestId('button-only'))

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with different icons', () => {
    const { getByTestId } = render(
      <ButtonOnly icon="check" testID="button-only" onPress={jest.fn()} />,
    )

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render with loading state', () => {
    const { getByTestId } = render(<ButtonOnly loading testID="button-only" onPress={jest.fn()} />)

    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('should render with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(
        <ButtonOnly size={size} testID="button-only" onPress={jest.fn()} />,
      )

      expect(getByTestId('button-only')).toBeTruthy()
      unmount()
    })
  })

  it('should render with different types', () => {
    const types = ['primary', 'secondary', 'tertiary'] as const

    types.forEach((type) => {
      const { getByTestId, unmount } = render(
        <ButtonOnly testID="button-only" type={type} onPress={jest.fn()} />,
      )

      expect(getByTestId('button-only')).toBeTruthy()
      unmount()
    })
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <ButtonOnly disabled testID="button-only" onPress={mockOnPress} />,
    )

    fireEvent.press(getByTestId('button-only'))

    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ButtonOnly className="custom-class" testID="button-only" onPress={jest.fn()} />,
    )

    expect(getByTestId('button-only')).toBeTruthy()
  })
})
