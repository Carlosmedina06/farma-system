import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Input } from '../Input'

jest.mock('../Input.hooks', () => ({
  useInputMask: jest.fn(() => ({
    usingMask: false,
    maskedValue: '',
    onChangeMask: jest.fn(),
  })),
}))

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

describe('Input', () => {
  it('should render with placeholder', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input placeholder="Enter text" testID="input" />,
    )

    expect(getByTestId('input')).toBeTruthy()
    expect(getByPlaceholderText('Enter text')).toBeTruthy()
  })

  it('should render with label', () => {
    const { getByText } = render(
      <Input label="Input Label" placeholder="Enter text" testID="input" />,
    )

    expect(getByText('Input Label')).toBeTruthy()
  })

  it('should render with value', () => {
    const { getByDisplayValue } = render(<Input testID="input" value="Test value" />)

    expect(getByDisplayValue('Test value')).toBeTruthy()
  })

  it('should call onChangeText when text changes', () => {
    const mockOnChangeText = jest.fn()
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" testID="input" onChangeText={mockOnChangeText} />,
    )

    const input = getByPlaceholderText('Enter text')

    fireEvent.changeText(input, 'New text')

    expect(mockOnChangeText).toHaveBeenCalledWith('New text')
  })

  it('should call onFocus when focused', () => {
    const mockOnFocus = jest.fn()
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" testID="input" onFocus={mockOnFocus} />,
    )

    const input = getByPlaceholderText('Enter text')

    fireEvent(input, 'focus')

    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('should call onBlur when blurred', () => {
    const mockOnBlur = jest.fn()
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" testID="input" onBlur={mockOnBlur} />,
    )

    const input = getByPlaceholderText('Enter text')

    fireEvent(input, 'blur')

    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('should render with error state', () => {
    const { getByText } = render(
      <Input error errorMessage="Error message" placeholder="Enter text" testID="input" />,
    )

    expect(getByText('Error message')).toBeTruthy()
  })

  it('should announce field name with specific error message for screen readers', () => {
    const { getByTestId } = render(
      <Input
        accessibilityLabel="Nombre"
        error
        errorMessage="El campo es obligatorio"
        label="Nombre"
        testID="input"
      />,
    )

    const textInput = getByTestId('input-input')
    const errorNode = getByTestId('input-error')

    expect(textInput.props.accessibilityLabel).toBe('Nombre, error, El campo es obligatorio')
    expect(errorNode.props.accessibilityLabel).toBe('Nombre, error, El campo es obligatorio')
    expect(errorNode.props.accessibilityLiveRegion).toBe('polite')
    expect(errorNode.props.accessibilityRole).toBe('text')
  })

  it('should render with helper text', () => {
    const { getByText } = render(
      <Input helperText="Helper text" placeholder="Enter text" testID="input" />,
    )

    expect(getByText('Helper text')).toBeTruthy()
  })

  it('should render with icon', () => {
    const { getByTestId } = render(
      <Input
        icon={{ name: 'search' as any, position: 'left', onPress: jest.fn() }}
        placeholder="Enter text"
        testID="input"
      />,
    )

    expect(getByTestId('icon-search')).toBeTruthy()
  })

  it('should be disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(
      <Input disabled placeholder="Enter text" testID="input" />,
    )

    const input = getByPlaceholderText('Enter text')

    expect(input.props.editable).toBe(false)
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Input className="custom-class" testID="input" />)

    expect(getByTestId('input')).toBeTruthy()
  })

  it('should render with rounded style', () => {
    const { getByTestId } = render(<Input rounded testID="input" />)

    expect(getByTestId('input')).toBeTruthy()
  })

  it('should render with filled style', () => {
    const { getByTestId } = render(<Input filled testID="input" />)

    expect(getByTestId('input')).toBeTruthy()
  })
  it('should show a focus glow only while focused', () => {
    const { getByPlaceholderText, queryByTestId } = render(
      <Input placeholder="Enter text" testID="input" />,
    )

    expect(queryByTestId('input-glow')).toBeNull()
    fireEvent(getByPlaceholderText('Enter text'), 'focus')
    expect(queryByTestId('input-glow')).toBeTruthy()
  })

  it('should assign object refs to the TextInput', () => {
    const ref = { current: null as any }

    render(<Input inputRef={ref} testID="input" />)

    expect(ref.current).toBeTruthy()
  })
})
