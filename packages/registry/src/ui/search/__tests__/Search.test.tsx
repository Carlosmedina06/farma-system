import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent } from '@testing-library/react-native'

import { Search } from '../Search'

const hiddenQueryOptions = { includeHiddenElements: true } as const

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function MockIcon({ name, testID, ...props }: any) {
      return <View testID={`icon-${name}`} {...props} />
    },
  }
})

describe('Search', () => {
  it('should render with default props', () => {
    const { getByPlaceholderText, getByTestId } = render(<Search testID="search" />)

    expect(getByTestId('search')).toBeTruthy()
    expect(getByPlaceholderText('Buscar')).toBeTruthy()
  })

  it('should render with custom placeholder', () => {
    const { getByPlaceholderText } = render(<Search placeholder="Search here" testID="search" />)

    expect(getByPlaceholderText('Search here')).toBeTruthy()
  })

  it('should render with value', () => {
    const { getByDisplayValue } = render(<Search testID="search" value="test search" />)

    expect(getByDisplayValue('test search')).toBeTruthy()
  })

  it('should call onFocus when focused', () => {
    const mockOnFocus = jest.fn()
    const { getByPlaceholderText } = render(<Search testID="search" onFocus={mockOnFocus} />)

    const input = getByPlaceholderText('Buscar')

    fireEvent(input, 'focus')

    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('should call onBlur when blurred', () => {
    const mockOnBlur = jest.fn()
    const { getByPlaceholderText } = render(<Search testID="search" onBlur={mockOnBlur} />)

    const input = getByPlaceholderText('Buscar')

    fireEvent(input, 'blur')

    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('should show clear button when value is provided', () => {
    const { getByTestId } = render(<Search testID="search" value="test" />)

    expect(getByTestId('icon-x-close')).toBeTruthy()
  })

  it('should call onClear when clear button is pressed', () => {
    const mockOnClear = jest.fn()
    const { getByTestId } = render(<Search testID="search" value="test" onClear={mockOnClear} />)

    const clearButton = getByTestId('icon-x-close').parent!

    fireEvent.press(clearButton)

    expect(mockOnClear).toHaveBeenCalled()
  })

  it('should be disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(<Search disabled testID="search" />)

    const input = getByPlaceholderText('Buscar')

    expect(input.props.editable).toBe(false)
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Search className="custom-class" testID="search" />)

    expect(getByTestId('search')).toBeTruthy()
  })

  it('should render search icon', () => {
    const { getByTestId } = render(<Search testID="search" />)

    expect(getByTestId('icon-search-sm', hiddenQueryOptions)).toBeTruthy()
  })

  it('should allow overriding the clear button accessibility label', () => {
    const { getByTestId } = render(
      <Search clearAccessibilityLabel="Clear search" clearTestID="clear" testID="search" value="x" />,
    )

    expect(getByTestId('clear').props.accessibilityLabel).toBe('Clear search')
  })

  it('should default the clear button label to "Borrar búsqueda"', () => {
    const { getByTestId } = render(<Search clearTestID="clear" testID="search" value="x" />)

    expect(getByTestId('clear').props.accessibilityLabel).toBe('Borrar búsqueda')
  })

  it('should call onSearch when the search icon is pressed', () => {
    const onSearch = jest.fn()
    const { getByTestId } = render(<Search testID="search" onSearch={onSearch} />)

    fireEvent.press(getByTestId('search-search', hiddenQueryOptions))

    expect(onSearch).toHaveBeenCalled()
  })

  it('should show the focus glow only while focused', () => {
    const { getByPlaceholderText, queryByTestId } = render(<Search testID="search" />)

    expect(queryByTestId('search-glow')).toBeNull()
    fireEvent(getByPlaceholderText('Buscar'), 'focus')
    expect(queryByTestId('search-glow')).toBeTruthy()
  })
})
