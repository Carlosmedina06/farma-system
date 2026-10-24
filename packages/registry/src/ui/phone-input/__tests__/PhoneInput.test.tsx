import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { PhoneInput } from '../PhoneInput'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name }: any) {
      return <View testID={`icon-${name}`} />
    },
  }
})

jest.mock('@farma/registry/ui/check-icon', () => {
  const { View } = require('react-native')

  return {
    CheckIcon: function MockCheckIcon() {
      return <View testID="check-icon" />
    },
  }
})

describe('PhoneInput', () => {
  it('should render default spanish texts', () => {
    const { getByText, getByPlaceholderText } = render(<PhoneInput testID="phone" />)

    expect(getByText('Número de teléfono')).toBeTruthy()
    expect(getByText('Código de área + número.')).toBeTruthy()
    expect(getByText('+54 9')).toBeTruthy()
    expect(getByPlaceholderText('11 1234 5678')).toBeTruthy()
  })

  it('should allow overriding label, helper, country code and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <PhoneInput
        countryCode="+1"
        helperText="Area code + number"
        label="Phone"
        placeholder="555 0100"
        testID="phone"
      />,
    )

    expect(getByText('Phone')).toBeTruthy()
    expect(getByText('Area code + number')).toBeTruthy()
    expect(getByText('+1')).toBeTruthy()
    expect(getByPlaceholderText('555 0100')).toBeTruthy()
  })

  it('should strip non digits and cap length', () => {
    const onChangeText = jest.fn()
    const { getByTestId } = render(<PhoneInput testID="phone" onChangeText={onChangeText} />)

    fireEvent.changeText(getByTestId('phone-input'), '(11) 1234-5678 99')

    expect(onChangeText).toHaveBeenCalledWith('1112345678')
  })

  it('should call onFocus/onBlur and show the glow while focused', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()
    const { getByTestId, queryByTestId } = render(
      <PhoneInput testID="phone" onBlur={onBlur} onFocus={onFocus} />,
    )

    fireEvent(getByTestId('phone-input'), 'focus')
    expect(onFocus).toHaveBeenCalled()
    expect(queryByTestId('phone-glow')).toBeTruthy()

    fireEvent(getByTestId('phone-input'), 'blur')
    expect(onBlur).toHaveBeenCalled()
    expect(queryByTestId('phone-glow')).toBeNull()
  })

  it('should render error message instead of helper text', () => {
    const { getByText, queryByText, getByTestId } = render(
      <PhoneInput error errorMessage="Número inválido" testID="phone" />,
    )

    expect(getByText('Número inválido')).toBeTruthy()
    expect(queryByText('Código de área + número.')).toBeNull()
    expect(getByTestId('icon-alert-circle')).toBeTruthy()
  })

  it('should render check icon when valid', () => {
    const { getByTestId } = render(<PhoneInput isValid testID="phone" value="1112345678" />)

    expect(getByTestId('check-icon')).toBeTruthy()
  })
})
