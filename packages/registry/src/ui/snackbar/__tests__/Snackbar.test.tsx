import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { Snackbar } from '../Snackbar'
import { SnackbarType } from '../Snackbar.types'

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')
  return { Icon: ({ name }: { name: string }) => <View testID={`icon-${name}`} /> }
})

describe('Snackbar', () => {
  it('renderiza el texto', () => {
    const { getByText } = render(<Snackbar text="Mensaje" />)

    expect(getByText('Mensaje')).toBeTruthy()
  })

  it.each(Object.values(SnackbarType))('renderiza el tipo %s', (type) => {
    const { getByText } = render(<Snackbar text="Mensaje" type={type} />)

    expect(getByText('Mensaje')).toBeTruthy()
  })

  it('muestra el ícono según el tipo con withIcon', () => {
    const { getByTestId, rerender } = render(<Snackbar withIcon text="Mensaje" />)
    expect(getByTestId('icon-info-circle')).toBeTruthy()

    rerender(<Snackbar withIcon text="Mensaje" type={SnackbarType.DefaultSuccess} />)
    expect(getByTestId('icon-check-circle')).toBeTruthy()
  })

  it('permite sobreescribir el ícono', () => {
    const { getByTestId } = render(<Snackbar withIcon icon="trash-01" text="Mensaje" />)

    expect(getByTestId('icon-trash-01')).toBeTruthy()
  })

  it('llama onPressAction al tocar la acción', () => {
    const onPressAction = jest.fn()
    const { getByTestId } = render(<Snackbar actionText="Deshacer" text="Mensaje" onPressAction={onPressAction} />)

    fireEvent.press(getByTestId('snackbar-action'))

    expect(onPressAction).toHaveBeenCalled()
  })

  it('llama onClose al tocar el snackbar o la X', () => {
    const onClose = jest.fn()
    const { getByTestId } = render(<Snackbar withCloseIcon text="Mensaje" onClose={onClose} />)

    fireEvent.press(getByTestId('snackbar'))
    fireEvent.press(getByTestId('snackbar-close'))

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('funciona sin onClose (no depende de ningún host)', () => {
    const { getByTestId } = render(<Snackbar text="Mensaje" />)

    expect(() => fireEvent.press(getByTestId('snackbar'))).not.toThrow()
  })
})
