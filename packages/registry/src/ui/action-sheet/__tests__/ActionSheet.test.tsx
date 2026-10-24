import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import ActionSheet from '../ActionSheet'
import type { ActionSheetOption } from '../ActionSheet.types'

jest.mock('@farma/registry/ui/bottom-sheet', () => {
  const { View } = require('react-native')

  return {
    BottomSheet: ({ children, open, title }: { children: React.ReactNode; open: boolean; title?: string }) => {
      if (!open) return null

      return (
        <View accessibilityLabel={title} testID="action-sheet-bottom-sheet">
          {children}
        </View>
      )
    },
  }
})

jest.mock('@farma/registry/ui/ripple-button', () => {
  const { Pressable } = require('react-native')

  return {
    RippleButtonEffect: ({ children, onPress, testID, disabled }: any) => (
      <Pressable disabled={disabled} testID={testID} onPress={onPress}>
        {children}
      </Pressable>
    ),
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return { Icon: ({ name }: any) => <View testID={`icon-${name}`} /> }
})

const mockClose = jest.fn()
const mockOnPickFile = jest.fn(async () => undefined)
const mockOnPickGallery = jest.fn(async () => undefined)
const mockOnTakePhoto = jest.fn(() => undefined)

const OPTIONS: ActionSheetOption[] = [
  { key: 'document', label: 'Seleccionar documento', icon: 'file-05', onPress: mockOnPickFile },
  { key: 'gallery', label: 'Seleccionar imagen', icon: 'image-plus', onPress: mockOnPickGallery },
  { key: 'camera', label: 'Tomar foto', icon: 'camera-plus', onPress: mockOnTakePhoto },
]

const renderSheet = (props: Partial<React.ComponentProps<typeof ActionSheet>> = {}) =>
  render(<ActionSheet open close={mockClose} options={OPTIONS} {...props} />)

describe('ActionSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not render options when closed', () => {
    const { queryByTestId } = renderSheet({ open: false })

    expect(queryByTestId('action-sheet')).toBeNull()
  })

  it('should render title, options and icons when open', () => {
    const { getByText, getByLabelText, getByTestId } = renderSheet({ title: 'Adjuntar' })

    expect(getByLabelText('Adjuntar')).toBeTruthy()
    expect(getByText('Seleccionar documento')).toBeTruthy()
    expect(getByText('Seleccionar imagen')).toBeTruthy()
    expect(getByText('Tomar foto')).toBeTruthy()
    expect(getByTestId('icon-file-05')).toBeTruthy()
  })

  it('should call each option onPress', () => {
    const { getByTestId } = renderSheet()

    fireEvent.press(getByTestId('action-sheet-document'))
    fireEvent.press(getByTestId('action-sheet-gallery'))
    fireEvent.press(getByTestId('action-sheet-camera'))

    expect(mockOnPickFile).toHaveBeenCalledTimes(1)
    expect(mockOnPickGallery).toHaveBeenCalledTimes(1)
    expect(mockOnTakePhoto).toHaveBeenCalledTimes(1)
    expect(mockClose).not.toHaveBeenCalled()
  })

  it('should call close after selecting when closeOnSelect', () => {
    const { getByTestId } = renderSheet({ closeOnSelect: true })

    fireEvent.press(getByTestId('action-sheet-camera'))

    expect(mockOnTakePhoto).toHaveBeenCalledTimes(1)
    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onPress of a disabled option', () => {
    const onPress = jest.fn(() => undefined)
    const { getByTestId } = renderSheet({
      options: [{ key: 'x', label: 'X', onPress: onPress as () => void, disabled: true }],
    })

    fireEvent.press(getByTestId('action-sheet-x'))

    expect(onPress).not.toHaveBeenCalled()
  })

  it('should render option description', () => {
    const { getByText } = renderSheet({
      options: [{ key: 'x', label: 'X', description: 'Detalle', onPress: jest.fn(() => undefined) }],
    })

    expect(getByText('Detalle')).toBeTruthy()
  })

  it('should render the info description only when provided', () => {
    const { queryByTestId, rerender, getByText } = renderSheet()

    expect(queryByTestId('action-sheet-info')).toBeNull()

    rerender(<ActionSheet open close={mockClose} description="Hasta 5 MB" options={OPTIONS} />)

    expect(getByText('Hasta 5 MB')).toBeTruthy()
    expect(queryByTestId('icon-info-circle')).toBeTruthy()
  })

  it('should render footer slot', () => {
    const { Text } = require('react-native')
    const { getByText } = renderSheet({ footer: <Text>Pie</Text> })

    expect(getByText('Pie')).toBeTruthy()
  })

  it('should use the custom testID prefix and per-option testID', () => {
    const { getByTestId } = renderSheet({
      testID: 'custom',
      options: [...OPTIONS, { key: 'other', label: 'Otro', onPress: jest.fn(() => undefined), testID: 'my-option' }],
    })

    expect(getByTestId('custom')).toBeTruthy()
    expect(getByTestId('custom-document')).toBeTruthy()
    expect(getByTestId('my-option')).toBeTruthy()
  })
})
