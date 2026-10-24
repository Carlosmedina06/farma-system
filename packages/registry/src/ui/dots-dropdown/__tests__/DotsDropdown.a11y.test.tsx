import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { MIN_TOUCH_TARGET_SIZE } from '@farma/registry/lib/tokens'

import { DotsDropdown } from '../DotsDropdown'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: ({ name }: any) => <View testID={`icon-${name}`} />,
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  }
})

describe('DotsDropdown accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should expose trigger button a11y props and min touch target', () => {
    const { getByTestId } = render(
      <DotsDropdown
        accessibilityHint="Menú de acciones para este elemento"
        accessibilityLabel="Más opciones"
        options={[{ label: 'Editar', onPress: jest.fn() }]}
        testID="dots-trigger"
      />,
    )

    const trigger = getByTestId('dots-trigger')

    expect(trigger.props.accessibilityRole).toBe('button')
    expect(trigger.props.accessibilityLabel).toBe('Más opciones')
    expect(trigger.props.accessibilityHint).toBe('Menú de acciones para este elemento')
    expect(trigger.props.accessibilityState).toEqual({ expanded: false })
    expect(trigger.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ minHeight: MIN_TOUCH_TARGET_SIZE, minWidth: MIN_TOUCH_TARGET_SIZE }),
      ]),
    )
  })

  it('should expose menu options to TalkBack without hiding them behind the backdrop', () => {
    const onEdit = jest.fn()
    const onDelete = jest.fn()

    const { getByTestId, getByLabelText } = render(
      <DotsDropdown
        isOpen
        options={[
          {
            label: 'Editar',
            accessibilityLabel: 'Editar este elemento',
            accessibilityHint: 'Permite editar el elemento',
            onPress: onEdit,
          },
          {
            label: 'Eliminar',
            accessibilityLabel: 'Eliminar este elemento',
            accessibilityHint: 'Permite eliminar el elemento',
            onPress: onDelete,
          },
        ]}
        testID="dots-trigger"
      />,
    )

    const modal = getByTestId('dots-trigger-modal')
    const backdrop = getByTestId('dots-trigger-backdrop', { includeHiddenElements: true })
    const editOption = getByLabelText('Editar este elemento')
    const deleteOption = getByLabelText('Eliminar este elemento')

    expect(modal.props.accessibilityViewIsModal).toBe(true)
    expect(backdrop.props.accessibilityElementsHidden).toBe(true)
    expect(backdrop.props.importantForAccessibility).toBe('no-hide-descendants')
    expect(editOption.props.accessibilityRole).toBe('menuitem')
    expect(editOption.props.accessibilityHint).toBe('Permite editar el elemento')
    expect(deleteOption.props.accessibilityRole).toBe('menuitem')
    expect(deleteOption.props.accessibilityHint).toBe('Permite eliminar el elemento')

    fireEvent.press(editOption)
    expect(onEdit).toHaveBeenCalledTimes(1)
  })
})
