import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { EmailInput } from '../EmailInput'

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

describe('EmailInput', () => {
  it('should render with label and placeholder', () => {
    const { getByText, getByPlaceholderText } = render(
      <EmailInput label="Email" placeholder="tu@email.com" testID="email" />,
    )

    expect(getByText('Email')).toBeTruthy()
    expect(getByPlaceholderText('tu@email.com')).toBeTruthy()
  })

  it('should call onChangeText when typing', () => {
    const onChangeText = jest.fn()
    const { getByTestId } = render(<EmailInput testID="email" onChangeText={onChangeText} />)

    fireEvent.changeText(getByTestId('email-input'), 'juan')

    expect(onChangeText).toHaveBeenCalledWith('juan')
  })

  it('should show default domains after typing @', () => {
    const onDropdownToggle = jest.fn()
    const { getByTestId } = render(
      <EmailInput testID="email" value="juan@" onDropdownToggle={onDropdownToggle} />,
    )

    fireEvent.changeText(getByTestId('email-input'), 'juan@')

    expect(getByTestId('email-domain-gmail.com')).toBeTruthy()
    expect(getByTestId('email-domain-hotmail.com')).toBeTruthy()
    expect(getByTestId('email-domain-yahoo.com')).toBeTruthy()
    expect(getByTestId('email-domain-outlook.com')).toBeTruthy()
    expect(onDropdownToggle).toHaveBeenLastCalledWith(true)
  })

  it('should filter domains by the typed prefix', () => {
    const { getByTestId, queryByTestId } = render(<EmailInput testID="email" value="juan@ho" />)

    fireEvent.changeText(getByTestId('email-input'), 'juan@ho')

    expect(getByTestId('email-domain-hotmail.com')).toBeTruthy()
    expect(queryByTestId('email-domain-gmail.com')).toBeNull()
  })

  it('should use custom domains when provided', () => {
    const { getByTestId, queryByTestId } = render(
      <EmailInput domains={['@empresa.com', '@empresa.org']} testID="email" value="juan@" />,
    )

    fireEvent.changeText(getByTestId('email-input'), 'juan@')

    expect(getByTestId('email-domain-empresa.com')).toBeTruthy()
    expect(getByTestId('email-domain-empresa.org')).toBeTruthy()
    expect(queryByTestId('email-domain-gmail.com')).toBeNull()
  })

  it('should complete the email when a domain is selected', () => {
    const onChangeText = jest.fn()
    const onSelectDomain = jest.fn()
    const { getByTestId } = render(
      <EmailInput
        testID="email"
        value="juan@gm"
        onChangeText={onChangeText}
        onSelectDomain={onSelectDomain}
      />,
    )

    fireEvent.changeText(getByTestId('email-input'), 'juan@gm')
    fireEvent.press(getByTestId('email-domain-gmail.com'))

    expect(onChangeText).toHaveBeenLastCalledWith('juan@gmail.com')
    expect(onSelectDomain).toHaveBeenCalledWith('@gmail.com')
  })

  it('should hide suggestions on exact domain match', () => {
    const { getByTestId, queryByTestId } = render(
      <EmailInput testID="email" value="juan@gmail.com" />,
    )

    fireEvent.changeText(getByTestId('email-input'), 'juan@gmail.com')

    expect(queryByTestId('email-domain-gmail.com')).toBeNull()
  })

  it('should render error message and alert icon', () => {
    const { getByText, getByTestId } = render(
      <EmailInput error errorMessage="Email inválido" testID="email" />,
    )

    expect(getByText('Email inválido')).toBeTruthy()
    expect(getByTestId('icon-alert-circle')).toBeTruthy()
  })

  it('should render check icon when valid', () => {
    const { getByTestId } = render(<EmailInput isValid testID="email" />)

    expect(getByTestId('check-icon')).toBeTruthy()
  })

  it('should not be editable when disabled', () => {
    const { getByTestId } = render(<EmailInput disabled testID="email" />)

    expect(getByTestId('email-input').props.editable).toBe(false)
  })
})
