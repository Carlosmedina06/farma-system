import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { Snackbar } from '../Snackbar'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 10, bottom: 0, left: 0, right: 0 }),
}))

describe('Snackbar', () => {
  it.each(['neutral', 'success', 'error'] as const)('renderiza la variante %s', (variant) => {
    const { getByText } = render(<Snackbar open text="Sin conexión" variant={variant} />)

    expect(getByText('Sin conexión')).toBeTruthy()
  })

  it('centra el texto', () => {
    const { getByTestId } = render(<Snackbar open text="Listo" variant="success" />)

    expect(getByTestId('snackbar-label').props.className).toContain('justify-center')
  })

  it('muestra la X solo con onDismiss y la llama', () => {
    const onDismiss = jest.fn()
    const { getByTestId, getByLabelText } = render(
      <Snackbar open testID="banner" text="Aviso" variant="neutral" onDismiss={onDismiss} />,
    )

    fireEvent.press(getByTestId('banner-dismiss'))

    expect(onDismiss).toHaveBeenCalled()
    expect(getByLabelText('Cerrar')).toBeTruthy()
  })

  it('llama onPressAction', () => {
    const onPressAction = jest.fn()
    const { getByTestId } = render(
      <Snackbar open actionText="Reintentar" text="Falló" variant="error" onPressAction={onPressAction} />,
    )

    fireEvent.press(getByTestId('snackbar-action'))

    expect(onPressAction).toHaveBeenCalled()
    expect(getByTestId('snackbar-label').props.className).toContain('justify-center')
  })
})
