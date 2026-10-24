import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Tag } from '../Tag'

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

describe('Tag', () => {
  it('should render with text', () => {
    const { getByText, getByTestId } = render(<Tag testID="tag" text="Test Tag" />)

    expect(getByTestId('tag')).toBeTruthy()
    expect(getByText('Test Tag')).toBeTruthy()
  })

  it('should render with checked state', () => {
    const { getByTestId } = render(<Tag checked={true} testID="tag" text="Tag" />)

    expect(getByTestId('tag')).toBeTruthy()
    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render with unchecked state', () => {
    const { getByTestId, queryByTestId } = render(<Tag checked={false} testID="tag" text="Tag" />)

    expect(getByTestId('tag')).toBeTruthy()
    expect(queryByTestId('icon-check')).toBeNull()
  })

  it('should render with icon', () => {
    const { getByTestId } = render(
      <Tag icon={{ name: 'star' as any, color: '#FFD700' }} testID="tag" text="Tag" />,
    )

    expect(getByTestId('tag')).toBeTruthy()
    expect(getByTestId('icon-star')).toBeTruthy()
  })

  it('should render with counter', () => {
    const { getByText } = render(<Tag counter={5} testID="tag" text="Tag" />)

    expect(getByText('5')).toBeTruthy()
  })

  it('should call onClose when close button is pressed', () => {
    const mockOnClose = jest.fn()
    const { getByTestId } = render(<Tag testID="tag" text="Tag" onClose={mockOnClose} />)

    const closeButton = getByTestId('icon-x-close').parent!

    fireEvent.press(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should render with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(<Tag size={size} testID="tag" text="Tag" />)

      expect(getByTestId('tag')).toBeTruthy()
      unmount()
    })
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Tag className="custom-class" testID="tag" text="Tag" />)

    expect(getByTestId('tag')).toBeTruthy()
  })

  it('should render with icon and custom size', () => {
    const { getByTestId } = render(
      <Tag icon={{ name: 'star' as any, color: '#FFD700', size: 20 }} testID="tag" text="Tag" />,
    )

    expect(getByTestId('tag')).toBeTruthy()
    expect(getByTestId('icon-star')).toBeTruthy()
  })
})
