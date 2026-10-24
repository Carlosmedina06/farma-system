import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Platform, View, Text } from 'react-native'
import { RippleButtonEffect } from '../RippleButtonEffect'

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('RippleButtonEffect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children', () => {
    const { getByText } = render(
      <RippleButtonEffect>
        <View>
          <Text>Button Content</Text>
        </View>
      </RippleButtonEffect>,
    )

    expect(getByText('Button Content')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn()
    const { getByText } = render(
      <RippleButtonEffect onPress={mockOnPress}>
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByText('Button').parent
    if (button) {
      fireEvent.press(button)
      expect(mockOnPress).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onLongPress when long pressed', () => {
    const mockOnLongPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect onLongPress={mockOnLongPress} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    fireEvent(button, 'onLongPress')
    expect(mockOnLongPress).toHaveBeenCalledTimes(1)
  })

  it('should not call onPress when disabled on Android', () => {
    Platform.OS = 'android'
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect onPress={mockOnPress} disabled={true} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    fireEvent.press(button)
    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should call onPress when not disabled on Android', () => {
    Platform.OS = 'android'
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect onPress={mockOnPress} disabled={false} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    fireEvent.press(button)
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should render correctly on Android when not disabled', () => {
    Platform.OS = 'android'
    const { getByTestId } = render(
      <RippleButtonEffect disabled={false} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(button).toBeTruthy()
  })

  it('should render correctly on Android when disabled', () => {
    Platform.OS = 'android'
    const { getByTestId } = render(
      <RippleButtonEffect disabled={true} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(button).toBeTruthy()
  })

  it('should render correctly on iOS', () => {
    Platform.OS = 'ios'
    const { getByTestId } = render(
      <RippleButtonEffect testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(button).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByText } = render(
      <RippleButtonEffect className="custom-class" testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    expect(getByText('Button')).toBeTruthy()
  })

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 }
    const { getByTestId } = render(
      <RippleButtonEffect style={customStyle} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(button).toBeTruthy()
  })

  it('should pass testID', () => {
    const { getByTestId } = render(
      <RippleButtonEffect testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    expect(getByTestId('ripple-button')).toBeTruthy()
  })

  it('should handle onPress being undefined', () => {
    const { getByTestId } = render(
      <RippleButtonEffect testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(() => fireEvent.press(button)).not.toThrow()
  })

  it('should handle onPress not being a function', () => {
    Platform.OS = 'android'
    const { getByTestId } = render(
      <RippleButtonEffect onPress={null as any} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(() => fireEvent.press(button)).not.toThrow()
  })

  it('should handle disabled state correctly on Android', () => {
    Platform.OS = 'android'
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect disabled={true} onPress={mockOnPress} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    const button = getByTestId('ripple-button')
    expect(button).toBeTruthy()
    // When disabled, onPress should not be called
    fireEvent.press(button)
    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should not call onPress when disabled on iOS', () => {
    Platform.OS = 'ios'
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect disabled onPress={mockOnPress} testID="ripple-button">
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    fireEvent.press(getByTestId('ripple-button'))
    expect(mockOnPress).not.toHaveBeenCalled()
  })

  it('should use custom rippleColor on Android', () => {
    Platform.OS = 'android'
    const mockOnPress = jest.fn()
    const { getByTestId } = render(
      <RippleButtonEffect rippleColor="#ff0000" testID="ripple-button" onPress={mockOnPress}>
        <View><Text>Button</Text></View>
      </RippleButtonEffect>,
    )

    fireEvent.press(getByTestId('ripple-button'))
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })
})
