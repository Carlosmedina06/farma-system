import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import { AttemptLimitModal } from '../AttemptLimitModal'

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}))

const baseProps = {
  title: 'Superaste la cantidad de intentos',
  description: 'Volvé a probar en 10:00.',
  buttonText: 'Volver al Inicio',
}

describe('AttemptLimitModal', () => {
  it('should render nothing when hidden', () => {
    const { toJSON } = render(<AttemptLimitModal {...baseProps} visible={false} onButtonPress={jest.fn()} />)

    expect(toJSON()).toBeNull()
  })

  it('should render title, description and button text when visible', () => {
    const { getByText } = render(<AttemptLimitModal {...baseProps} visible onButtonPress={jest.fn()} />)

    expect(getByText('Superaste la cantidad de intentos')).toBeTruthy()
    expect(getByText('Volvé a probar en 10:00.')).toBeTruthy()
    expect(getByText('Volver al Inicio')).toBeTruthy()
  })

  it('should not render the description when omitted', () => {
    const { queryByTestId } = render(
      <AttemptLimitModal buttonText="OK" title="Título" visible onButtonPress={jest.fn()} />,
    )

    expect(queryByTestId('attempt-limit-modal-description')).toBeNull()
  })

  it('should call onButtonPress when the button is pressed', () => {
    const onButtonPress = jest.fn()
    const { getByTestId } = render(
      <AttemptLimitModal {...baseProps} visible testID="limit" onButtonPress={onButtonPress} />,
    )

    fireEvent.press(getByTestId('limit-button'))

    expect(onButtonPress).toHaveBeenCalledTimes(1)
  })
})
