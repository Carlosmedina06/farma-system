import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { ButtonGroup } from '../ButtonGroup'

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

describe('ButtonGroup', () => {
  const mockButtons = [
    { id: '1', text: 'Button 1', onPress: jest.fn() },
    { id: '2', text: 'Button 2', onPress: jest.fn() },
    { id: '3', text: 'Button 3', onPress: jest.fn() },
  ]

  it('should render with buttons', () => {
    const { getByText } = render(<ButtonGroup buttons={mockButtons} />)

    expect(getByText('Button 1')).toBeTruthy()
    expect(getByText('Button 2')).toBeTruthy()
    expect(getByText('Button 3')).toBeTruthy()
  })

  it('should call onPress when button is pressed', () => {
    const mockOnPress = jest.fn()
    const buttons = [{ id: '1', text: 'Button', onPress: mockOnPress }]

    const { getByText } = render(<ButtonGroup buttons={buttons} />)

    fireEvent.press(getByText('Button'))

    expect(mockOnPress).toHaveBeenCalled()
  })

  it('should render with icons', () => {
    const buttonsWithIcons = [
      { id: '1', text: 'Button 1', icon: 'check' as const, onPress: jest.fn() },
      { id: '2', text: 'Button 2', icon: 'x-close' as const, onPress: jest.fn() },
    ]

    const { getByTestId } = render(<ButtonGroup buttons={buttonsWithIcons} />)

    expect(getByTestId('icon-check')).toBeTruthy()
    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should render with single button', () => {
    const singleButton = [{ id: '1', text: 'Single', onPress: jest.fn() }]

    const { getByText } = render(<ButtonGroup buttons={singleButton} />)

    expect(getByText('Single')).toBeTruthy()
  })
})
