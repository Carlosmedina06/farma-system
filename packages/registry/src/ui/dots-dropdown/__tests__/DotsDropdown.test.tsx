import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, render } from '@testing-library/react-native'

import { MIN_TOUCH_TARGET_SIZE } from '@farma/registry/lib/tokens'

import { DotsDropdown } from '../DotsDropdown'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: ({ name, testID }: any) => <View testID={testID || `icon-${name}`} />,
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  }
})

describe('DotsDropdown', () => {
  const mockOptions = [
    { label: 'Option 1', icon: 'edit-01' as any, onPress: jest.fn() },
    { label: 'Option 2', icon: 'trash-01' as any, onPress: jest.fn() },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render dots icon', () => {
    const { getByTestId } = render(<DotsDropdown options={mockOptions} />)

    expect(getByTestId('icon-dots-horizontal')).toBeTruthy()
  })

  it('should use "Más opciones" as default accessibility label', () => {
    const { getByTestId } = render(<DotsDropdown options={mockOptions} />)

    expect(getByTestId('dots-dropdown').props.accessibilityLabel).toBe('Más opciones')
  })

  it('should render options when open', () => {
    const { getByTestId, getByText } = render(<DotsDropdown isOpen options={mockOptions} />)

    expect(getByTestId('dots-dropdown-modal')).toBeTruthy()
    expect(getByText('Option 1')).toBeTruthy()
    expect(getByText('Option 2')).toBeTruthy()
    expect(getByTestId('dots-dropdown').props.accessibilityState).toEqual({ expanded: true })
  })

  it('should call pressDots when provided', () => {
    const pressDots = jest.fn()
    const { getByTestId } = render(<DotsDropdown options={mockOptions} pressDots={pressDots} />)

    fireEvent.press(getByTestId('dots-dropdown'))

    expect(pressDots).toHaveBeenCalled()
  })

  it('should call option onPress', () => {
    const { getByTestId } = render(<DotsDropdown isOpen options={mockOptions} />)

    fireEvent.press(getByTestId('dots-dropdown-option-1'))

    expect(mockOptions[1]!.onPress).toHaveBeenCalledTimes(1)
  })

  it('should unmount the modal after the close animation', () => {
    jest.useFakeTimers()
    const { queryByTestId, rerender } = render(<DotsDropdown isOpen options={mockOptions} />)

    expect(queryByTestId('dots-dropdown-modal')).toBeTruthy()
    rerender(<DotsDropdown isOpen={false} options={mockOptions} />)
    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(queryByTestId('dots-dropdown-modal')).toBeNull()
    jest.useRealTimers()
  })

  it('should render option icons', () => {
    const { getByTestId } = render(<DotsDropdown isOpen options={mockOptions} />)

    expect(getByTestId('icon-edit-01', { includeHiddenElements: true })).toBeTruthy()
  })

  it('should apply custom style keeping the min touch target', () => {
    const { getByTestId } = render(
      <DotsDropdown options={mockOptions} style={{ backgroundColor: 'red' }} testID="dots-dropdown" />,
    )

    expect(getByTestId('dots-dropdown').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ minHeight: MIN_TOUCH_TARGET_SIZE, minWidth: MIN_TOUCH_TARGET_SIZE }),
      ]),
    )
  })

  it('should handle empty options array', () => {
    const { getByTestId } = render(<DotsDropdown options={[]} position="left" />)

    expect(getByTestId('icon-dots-horizontal')).toBeTruthy()
  })
})
