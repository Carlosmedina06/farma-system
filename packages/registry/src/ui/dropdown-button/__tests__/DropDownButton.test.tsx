import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { DropDownButton } from '../DropDownButton'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name, testID, ...props }: any) {
      return <View testID={`icon-${name}`} {...props} />
    },
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({ children, ...props }: any) {
      return <Text {...props}>{children}</Text>
    },
  }
})

describe('DropDownButton', () => {
  it('should render with text', () => {
    const { getByText, getByTestId } = render(
      <DropDownButton testID="dropdown" text="Select option" />,
    )

    expect(getByTestId('dropdown')).toBeTruthy()
    expect(getByText('Select option')).toBeTruthy()
  })

  it('should render with label', () => {
    const { getByText } = render(<DropDownButton label="Label" testID="dropdown" text="Select" />)

    expect(getByText('Label')).toBeTruthy()
  })

  it('should render with value', () => {
    const { getByText } = render(
      <DropDownButton testID="dropdown" text="Select" value="Selected value" />,
    )

    expect(getByText('Selected value')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <DropDownButton testID="dropdown" text="Select" onPress={mockOnPress} />,
    )

    const button = getByTestId('dropdown-button')

    fireEvent.press(button)

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with error state', () => {
    const { getByText } = render(
      <DropDownButton error errorMessage="Error message" testID="dropdown" text="Select" />,
    )

    expect(getByText('Error message')).toBeTruthy()
  })

  it('should render with small size', () => {
    const { getByTestId } = render(<DropDownButton small testID="dropdown" text="Select" />)

    expect(getByTestId('dropdown')).toBeTruthy()
  })

  it('should render disabled state', () => {
    const { getByTestId } = render(<DropDownButton disabled testID="dropdown" text="Select" />)

    expect(getByTestId('dropdown')).toBeTruthy()
  })

  it('should render chevron icon', () => {
    const { getByTestId } = render(<DropDownButton testID="dropdown" text="Select" />)

    expect(getByTestId('icon-chevron-down')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <DropDownButton className="custom-class" testID="dropdown" text="Select" />,
    )

    expect(getByTestId('dropdown')).toBeTruthy()
  })

  it('should display the value as-is by default', () => {
    const { getByText } = render(
      <DropDownButton testID="dropdown" text="Select" value="la plata" />,
    )

    expect(getByText('la plata')).toBeTruthy()
  })

  it('should format the value with formatValue', () => {
    const formatValue = jest.fn((value: string) => value.toUpperCase())
    const { getByText } = render(
      <DropDownButton formatValue={formatValue} testID="dropdown" text="Select" value="la plata" />,
    )

    expect(getByText('LA PLATA')).toBeTruthy()
    expect(formatValue).toHaveBeenCalledWith('la plata')
  })

  it('should not call formatValue when there is no value', () => {
    const formatValue = jest.fn((value: string) => value)
    const { getByText } = render(
      <DropDownButton formatValue={formatValue} testID="dropdown" text="Select" />,
    )

    expect(getByText('Select')).toBeTruthy()
    expect(formatValue).not.toHaveBeenCalled()
  })
})
