import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Chip } from '../Chip'

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

describe('Chip', () => {
  it('should render with children', () => {
    const { getByText, getByTestId } = render(<Chip testID="chip">Test Chip</Chip>)

    expect(getByTestId('chip')).toBeTruthy()
    expect(getByText('Test Chip')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <Chip testID="chip" onPress={mockOnPress}>
        Test
      </Chip>,
    )

    fireEvent.press(getByTestId('chip'))

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with close icon when close prop is true', () => {
    const { getByTestId } = render(
      <Chip close testID="chip">
        Test
      </Chip>,
    )

    expect(getByTestId('icon-x-close', { includeHiddenElements: true })).toBeTruthy()
  })

  it('should render with different types', () => {
    const types = ['info', 'success', 'error', 'warning', 'gray', 'selected', 'tag'] as const

    types.forEach((type) => {
      const { getByTestId, unmount } = render(
        <Chip testID="chip" type={type}>
          Test
        </Chip>,
      )

      expect(getByTestId('chip')).toBeTruthy()
      unmount()
    })
  })

  it('should render with selected state', () => {
    const { getByTestId } = render(
      <Chip selected testID="chip">
        Selected
      </Chip>,
    )

    expect(getByTestId('chip')).toBeTruthy()
  })

  it('should render with checked state', () => {
    const { getByTestId } = render(
      <Chip checked testID="chip">
        Checked
      </Chip>,
    )

    expect(getByTestId('chip')).toBeTruthy()
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <Chip disabled testID="chip" onPress={mockOnPress}>
        Disabled
      </Chip>,
    )

    fireEvent.press(getByTestId('chip'))

    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Chip className="custom-class" testID="chip">
        Test
      </Chip>,
    )

    expect(getByTestId('chip')).toBeTruthy()
  })

  it('should apply custom fontWeight', () => {
    const { getByText } = render(
      <Chip fontWeight={700} testID="chip">
        Test
      </Chip>,
    )

    expect(getByText('Test')).toBeTruthy()
  })
})
