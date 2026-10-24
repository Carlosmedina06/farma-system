import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { InlineSnackbar } from '../InlineSnackbar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 0, left: 0, right: 0 }),
}))

describe('InlineSnackbar', () => {
  it.each(['neutral', 'success', 'error'] as const)('renderiza la variante %s', (variant) => {
    const { getByText } = render(<InlineSnackbar open text="Sin conexión" variant={variant} />)

    expect(getByText('Sin conexión')).toBeTruthy()
  })

  it('muestra la X solo con onDismiss y la llama', () => {
    const onDismiss = jest.fn()
    const { getByTestId, getByLabelText } = render(
      <InlineSnackbar open testID="banner" text="Aviso" variant="neutral" onDismiss={onDismiss} />,
    )

    fireEvent.press(getByTestId('banner-dismiss'))

    expect(onDismiss).toHaveBeenCalled()
    expect(getByLabelText('Cerrar')).toBeTruthy()
  })

  it('permite cambiar la etiqueta de cerrar', () => {
    const { getByLabelText } = render(
      <InlineSnackbar open dismissLabel="Descartar" text="Aviso" variant="neutral" onDismiss={jest.fn()} />,
    )

    expect(getByLabelText('Descartar')).toBeTruthy()
  })

  it('centra el texto con centered si no hay acción', () => {
    const { getByTestId } = render(<InlineSnackbar centered open testID="banner" text="Listo" variant="success" />)

    expect(getByTestId('banner-label').props.className).toContain('justify-center')
  })

  it('alinea a la izquierda cuando hay acción', () => {
    const { getByTestId } = render(
      <InlineSnackbar
        centered
        open
        actionText="Reintentar"
        testID="banner"
        text="Falló"
        variant="error"
        onPressAction={jest.fn()}
      />,
    )

    expect(getByTestId('banner-label').props.className).toContain('justify-start')
  })
})
