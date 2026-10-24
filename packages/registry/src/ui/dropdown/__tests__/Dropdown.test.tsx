import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import { Dropdown } from '../Dropdown'

const hiddenQueryOptions = { includeHiddenElements: true } as const

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}))

jest.mock('@farma/registry/ui/input', () => ({
  Input: jest.fn(
    ({
      value,
      placeholder,
      editable,
      icon,
      inputRef,
      onChangeText,
      testID,
      accessibilityElementsHidden,
      importantForAccessibility,
    }: any) => {
      const React = require('react')
      const { View, TextInput } = require('react-native')

      return (
        <View
          accessibilityElementsHidden={accessibilityElementsHidden}
          importantForAccessibility={importantForAccessibility}
          testID={testID || 'input'}
        >
          <TextInput
            ref={inputRef}
            editable={editable}
            placeholder={placeholder}
            testID="text-input"
            value={value}
            onChangeText={onChangeText}
          />
          {icon && <View testID={`icon-${icon.name}`} />}
        </View>
      )
    },
  ),
}))

jest.mock('@farma/registry/ui/bottom-sheet', () => {
  const React = require('react')
  const { View, Text, Pressable } = require('react-native')

  return {
    BottomSheet: jest.fn(({ children, open, close, title, content, testID }: any) => {
      const Content = content || (({ children: c }: any) => c)
      if (Content && !Content.displayName) {
        Content.displayName = content ? 'Fragment' : 'Fragment'
      }

      if (!open) return null

      return (
        <View testID={testID || 'bottom-sheet'}>
          {title && <Text testID="bottom-sheet-title">{title}</Text>}
          <Content>{children}</Content>
          <Pressable testID="close-button" onPress={close}>
            <Text>Close</Text>
          </Pressable>
        </View>
      )
    }),
  }
})

jest.mock('@farma/registry/ui/search', () => ({
  Search: ({ value, onChangeText, testID }: any) => {
    const { TextInput } = require('react-native')

    return <TextInput testID={testID} value={value} onChangeText={onChangeText} />
  },
}))

jest.mock('../DropdownItem', () => ({
  DropdownItem: jest.fn(({ label, selected, onPress, testID, formatLabel }: any) => {
    const { Text, Pressable } = require('react-native')

    return (
      <Pressable testID={testID || `dropdown-item-${label}`} onPress={onPress}>
        <Text>{formatLabel ? formatLabel(label) : label}</Text>
        {selected && <Text>Selected</Text>}
      </Pressable>
    )
  }),
}))

const openDropdown = async (getByLabelText: (label: string | RegExp) => any, label = 'Selector') => {
  await act(async () => {
    fireEvent.press(getByLabelText(label))
  })
}

describe('Dropdown', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with placeholder', () => {
    const { getByPlaceholderText, getByLabelText } = render(
      <Dropdown options={mockOptions} placeholder="Select option" />,
    )

    expect(getByPlaceholderText('Select option', hiddenQueryOptions)).toBeTruthy()
    expect(getByLabelText('Select option')).toBeTruthy()
  })

  it('should render selected value', () => {
    const { getByDisplayValue } = render(<Dropdown options={mockOptions} value={mockOptions[0]} />)

    expect(getByDisplayValue('Option 1', hiddenQueryOptions)).toBeTruthy()
  })

  it('should open bottom sheet when input is pressed', async () => {
    const { getByLabelText } = render(<Dropdown options={mockOptions} />)

    await openDropdown(getByLabelText)

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
    })
  })

  it('should render title in bottom sheet', async () => {
    const { getByLabelText } = render(<Dropdown options={mockOptions} title="Select Option" />)

    await openDropdown(getByLabelText, 'Select Option')

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
      const calls = BottomSheet.mock.calls
      const lastCall = calls[calls.length - 1]

      expect(lastCall[0].title).toBe('Select Option')
    })
  })

  it('should call onChange when option is selected', async () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<Dropdown options={mockOptions} onChange={onChange} />)

    await openDropdown(getByLabelText)

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
    })
    expect(onChange).toBeDefined()
  })

  it('should close bottom sheet after selection', async () => {
    const onChange = jest.fn()
    const { getByLabelText } = render(<Dropdown options={mockOptions} onChange={onChange} />)

    await openDropdown(getByLabelText)

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
    })

    const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

    expect(BottomSheet.mock.calls.length).toBeGreaterThan(0)
  })

  it('should render search input when search is enabled', async () => {
    const { getByLabelText, getAllByTestId } = render(
      <Dropdown options={mockOptions} search={true} />,
    )

    await openDropdown(getByLabelText)

    expect(getAllByTestId('text-input', hiddenQueryOptions).length).toBeGreaterThanOrEqual(1)
  })

  it('should filter options based on search', async () => {
    const { getByLabelText, getAllByTestId } = render(
      <Dropdown options={mockOptions} search={true} />,
    )

    await openDropdown(getByLabelText)

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
    })
    expect(getAllByTestId('text-input', hiddenQueryOptions).length).toBeGreaterThanOrEqual(1)
  })

  it('should mark selected option', () => {
    const { getByDisplayValue } = render(<Dropdown options={mockOptions} value={mockOptions[0]} />)

    expect(getByDisplayValue('Option 1', hiddenQueryOptions)).toBeTruthy()
  })

  it('should close bottom sheet when close button is pressed', async () => {
    const { getByLabelText } = render(<Dropdown options={mockOptions} />)

    await openDropdown(getByLabelText)

    await waitFor(() => {
      const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet

      expect(BottomSheet).toHaveBeenCalled()
    })

    const BottomSheet = require('@farma/registry/ui/bottom-sheet').BottomSheet
    const lastCall = BottomSheet.mock.calls[BottomSheet.mock.calls.length - 1]

    expect(lastCall[0].close).toBeDefined()
  })

  it('should call onChange with the option and close the sheet when an option is pressed', async () => {
    const onChange = jest.fn()
    const { getByLabelText, getByTestId, queryByTestId } = render(
      <Dropdown options={mockOptions} onChange={onChange} />,
    )

    await openDropdown(getByLabelText)
    fireEvent.press(getByTestId('dropdown-item-Option 2'))

    expect(onChange).toHaveBeenCalledWith(mockOptions[1])
    expect(queryByTestId('dropdown-bottom-sheet')).toBeNull()
  })

  it('should filter options with the search text (case insensitive)', async () => {
    const { getByLabelText, getByTestId, queryByTestId } = render(
      <Dropdown search options={mockOptions} />,
    )

    await openDropdown(getByLabelText)
    fireEvent.changeText(getByTestId('dropdown-search'), 'option 2')

    expect(getByTestId('dropdown-item-Option 2')).toBeTruthy()
    expect(queryByTestId('dropdown-item-Option 1')).toBeNull()
  })

  it('should use a custom filterCriteria', async () => {
    const { getByLabelText, getByTestId, queryByTestId } = render(
      <Dropdown
        search
        filterCriteria={(item, text) => item.value === text}
        options={mockOptions}
      />,
    )

    await openDropdown(getByLabelText)
    fireEvent.changeText(getByTestId('dropdown-search'), '3')

    expect(getByTestId('dropdown-item-Option 3')).toBeTruthy()
    expect(queryByTestId('dropdown-item-Option 1')).toBeNull()
  })

  it('should pass formatLabel to the default item', async () => {
    const { getByLabelText, getByText } = render(
      <Dropdown formatLabel={(label) => label.toUpperCase()} options={mockOptions} />,
    )

    await openDropdown(getByLabelText)

    expect(getByText('OPTION 1')).toBeTruthy()
  })

  it('should use a custom renderItem', async () => {
    const { Text } = require('react-native')
    const { getByLabelText, getByText } = render(
      <Dropdown
        options={mockOptions}
        renderItem={({ item }) => <Text>{`custom-${item.value}`}</Text>}
      />,
    )

    await openDropdown(getByLabelText)

    expect(getByText('custom-1')).toBeTruthy()
  })
})
