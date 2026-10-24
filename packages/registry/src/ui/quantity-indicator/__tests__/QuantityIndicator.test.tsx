import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { QuantityIndicator } from '../QuantityIndicator'

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

describe('QuantityIndicator', () => {
  it('should render with quantity', () => {
    const { getByText, getByTestId } = render(
      <QuantityIndicator quantity={5} testID="quantity-indicator" />,
    )

    expect(getByTestId('quantity-indicator')).toBeTruthy()
    expect(getByText('5')).toBeTruthy()
  })

  it('should render with onPress handler', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <QuantityIndicator quantity={3} testID="quantity-indicator" onPress={mockOnPress} />,
    )

    const indicator = getByTestId('quantity-indicator')

    fireEvent.press(indicator.parent || indicator)

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render without onPress handler', () => {
    const { getByTestId } = render(<QuantityIndicator quantity={10} testID="quantity-indicator" />)

    expect(getByTestId('quantity-indicator')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <QuantityIndicator className="custom-class" quantity={1} testID="quantity-indicator" />,
    )

    expect(getByTestId('quantity-indicator')).toBeTruthy()
  })

  it('should render with different quantities', () => {
    const quantities = [0, 1, 5, 10, 99, 100]

    quantities.forEach((quantity) => {
      const { getByText, unmount } = render(
        <QuantityIndicator quantity={quantity} testID="quantity-indicator" />,
      )

      expect(getByText(quantity.toString())).toBeTruthy()
      unmount()
    })
  })
})
