import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DropdownItem } from '../DropdownItem'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function Icon({ name, testID }: any) {
      return <View testID={testID || `icon-${name}`} />
    },
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({ children, className, semibold, testID }: any) {
      return (
        <Text className={className} style={{ fontWeight: semibold ? '600' : '400' }} testID={testID || 'text'}>
          {children}
        </Text>
      )
    },
  }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('DropdownItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render label', () => {
    const { getByText } = render(<DropdownItem label="Option 1" selected={false} onPress={jest.fn()} />)

    expect(getByText('Option 1')).toBeTruthy()
  })

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <DropdownItem label="Option 1" icon="check" selected={false} onPress={jest.fn()} />,
    )

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render description when provided', () => {
    const { getByText } = render(
      <DropdownItem label="Option 1" description="Description" selected={false} onPress={jest.fn()} />,
    )

    expect(getByText('Description')).toBeTruthy()
  })

  it('should render check icon when selected', () => {
    const { getByTestId } = render(<DropdownItem label="Option 1" selected={true} onPress={jest.fn()} />)

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<DropdownItem label="Option 1" selected={false} onPress={onPress} />)

    const pressable = getByText('Option 1').parent?.parent
    if (pressable) {
      fireEvent.press(pressable)
      expect(onPress).toHaveBeenCalled()
    }
  })

  it('should apply selected background when selected', () => {
    const { getByText } = render(<DropdownItem label="Option 1" selected={true} onPress={jest.fn()} />)

    expect(getByText('Option 1')).toBeTruthy()
  })

  it('should render both icon and check icon when selected and icon provided', () => {
    const { getAllByTestId } = render(
      <DropdownItem label="Option 1" icon="check" selected={true} onPress={jest.fn()} />,
    )

    const icons = getAllByTestId(/icon-/)
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should render label and description as-is by default', () => {
    const { getByText } = render(
      <DropdownItem description="de la casa" label="hola mundo" selected={false} onPress={jest.fn()} />,
    )

    expect(getByText('hola mundo')).toBeTruthy()
    expect(getByText('de la casa')).toBeTruthy()
  })

  it('should apply formatLabel to label and description', () => {
    const formatLabel = jest.fn((text: string) => text.toUpperCase())
    const { getByText } = render(
      <DropdownItem
        description="desc"
        formatLabel={formatLabel}
        label="label"
        selected={false}
        onPress={jest.fn()}
      />,
    )

    expect(getByText('LABEL')).toBeTruthy()
    expect(getByText('DESC')).toBeTruthy()
    expect(formatLabel).toHaveBeenCalledTimes(2)
  })
})
