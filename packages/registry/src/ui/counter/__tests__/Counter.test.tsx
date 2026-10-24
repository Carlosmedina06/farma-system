import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Counter } from '../Counter'

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

describe('Counter', () => {
  it('should render with default value', () => {
    const { getByText, getByTestId } = render(<Counter testID="counter" />)

    expect(getByTestId('counter')).toBeTruthy()
    expect(getByText('0')).toBeTruthy()
  })

  it('should render with custom value', () => {
    const { getByText } = render(<Counter testID="counter" value={5} />)

    expect(getByText('5')).toBeTruthy()
  })

  it('should call onIncrement when incrementing', () => {
    const mockOnIncrement = jest.fn()
    const { getByTestId } = render(
      <Counter testID="counter" value={0} onIncrement={mockOnIncrement} />,
    )

    const plusButton = getByTestId('icon-plus').parent!

    fireEvent.press(plusButton)

    expect(mockOnIncrement).toHaveBeenCalled()
  })

  it('should call onDecrement when decrementing', () => {
    const mockOnDecrement = jest.fn()
    const { getByTestId } = render(
      <Counter testID="counter" value={5} onDecrement={mockOnDecrement} />,
    )

    const minusButton = getByTestId('icon-minus').parent!

    fireEvent.press(minusButton)

    expect(mockOnDecrement).toHaveBeenCalled()
  })

  it('should call onRemove when removing item', () => {
    const mockOnRemove = jest.fn()
    const { getByTestId } = render(<Counter testID="counter" value={1} onRemove={mockOnRemove} />)

    const trashButton = getByTestId('icon-trash-01').parent!

    fireEvent.press(trashButton)

    expect(mockOnRemove).toHaveBeenCalled()
  })

  it('should call onChange when incrementing (backward compatibility)', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Counter testID="counter" value={0} onChange={mockOnChange} />)

    const plusButton = getByTestId('icon-plus').parent!

    fireEvent.press(plusButton)

    expect(mockOnChange).toHaveBeenCalledWith(1)
  })

  it('should call onChange when decrementing (backward compatibility)', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(<Counter testID="counter" value={5} onChange={mockOnChange} />)

    const minusButton = getByTestId('icon-minus').parent!

    fireEvent.press(minusButton)

    expect(mockOnChange).toHaveBeenCalledWith(4)
  })

  it('should call both onIncrement and onChange when both are provided', () => {
    const mockOnIncrement = jest.fn()
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Counter testID="counter" value={0} onChange={mockOnChange} onIncrement={mockOnIncrement} />,
    )

    const plusButton = getByTestId('icon-plus').parent!

    fireEvent.press(plusButton)

    expect(mockOnIncrement).toHaveBeenCalled()
    expect(mockOnChange).toHaveBeenCalledWith(1)
  })

  it('should show trash icon when value is 1', () => {
    const { getByTestId } = render(<Counter testID="counter" value={1} />)

    expect(getByTestId('icon-trash-01')).toBeTruthy()
  })

  it('should show minus icon when value is greater than 1', () => {
    const { getByTestId } = render(<Counter testID="counter" value={2} />)

    expect(getByTestId('icon-minus')).toBeTruthy()
  })

  it('should not increment beyond max', () => {
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Counter max={10} testID="counter" value={10} onChange={mockOnChange} />,
    )

    const plusButton = getByTestId('icon-plus').parent!

    fireEvent.press(plusButton)

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should not call callbacks when value is 0 and button is disabled', () => {
    const mockOnDecrement = jest.fn()
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Counter testID="counter" value={0} onChange={mockOnChange} onDecrement={mockOnDecrement} />,
    )

    const minusButton = getByTestId('icon-minus').parent!

    fireEvent.press(minusButton)

    expect(mockOnDecrement).not.toHaveBeenCalled()
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    const mockOnIncrement = jest.fn()
    const mockOnChange = jest.fn()
    const { getByTestId } = render(
      <Counter
        disabled
        testID="counter"
        value={5}
        onChange={mockOnChange}
        onIncrement={mockOnIncrement}
      />,
    )

    const plusButton = getByTestId('icon-plus').parent!

    fireEvent.press(plusButton)

    expect(mockOnIncrement).not.toHaveBeenCalled()
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Counter className="custom-class" testID="counter" />)

    expect(getByTestId('counter')).toBeTruthy()
  })
})
