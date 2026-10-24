import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { act, render } from '@testing-library/react-native'

import { FeedbackScreen } from '../FeedbackScreen'
import { FeedbackScreenHost, feedbackScreen, useFeedback } from '../FeedbackScreenHost'

const mockView = jest.fn()

jest.mock('../FeedbackScreenView', () => {
  const { Text, View } = require('react-native')
  return {
    __esModule: true,
    default: (props: any) => {
      mockView(props)
      return (
        <View testID={props.testID ?? 'feedback'}>
          <Text>{props.title}</Text>
        </View>
      )
    },
  }
})

const lastViewProps = () => mockView.mock.calls.at(-1)![0] as Record<string, () => void>

describe('FeedbackScreen (controlado, sin Host)', () => {
  afterEach(() => {
    mockView.mockClear()
  })

  it('no renderiza nada si no es visible', () => {
    const { queryByTestId } = render(<FeedbackScreen title="Listo" type="success" visible={false} />)

    expect(queryByTestId('feedback')).toBeNull()
  })

  it('al tocar la acción primaria llama onPress, onDismiss y onClose en orden', () => {
    const calls: string[] = []
    render(
      <FeedbackScreen
        visible
        primaryAction={{ label: 'Continuar', onPress: () => calls.push('onPress') }}
        title="Listo"
        type="success"
        onClose={() => calls.push('onClose')}
        onDismiss={() => calls.push('onDismiss')}
      />,
    )

    act(() => lastViewProps().onPrimaryPress!())

    expect(calls).toEqual(['onPress', 'onDismiss', 'onClose'])
  })

  it('la acción secundaria y la automática también cierran', () => {
    const onClose = jest.fn()
    const onAction = jest.fn()
    render(
      <FeedbackScreen
        visible
        autoAction={{ delayMs: 1000, onAction }}
        secondaryAction={{ label: 'Volver' }}
        title="Error"
        type="error"
        onClose={onClose}
      />,
    )

    act(() => lastViewProps().onSecondaryPress!())
    act(() => lastViewProps().onAutoActionPress!())

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})

describe('FeedbackScreenHost', () => {
  afterEach(() => {
    act(() => feedbackScreen.hide())
  })

  it('muestra y oculta con feedbackScreen.show / hide', () => {
    const { getByText, queryByText } = render(<FeedbackScreenHost />)

    act(() => feedbackScreen.show({ title: 'Pago aprobado', type: 'success' }))
    expect(getByText('Pago aprobado')).toBeTruthy()

    act(() => feedbackScreen.hide())
    expect(queryByText('Pago aprobado')).toBeNull()
  })

  it('se cierra solo después de una acción', () => {
    const { queryByText } = render(<FeedbackScreenHost />)

    act(() => useFeedbackApi().showFeedback({ title: 'Hecho', type: 'info', primaryAction: { label: 'Ok' } }))
    act(() => lastViewProps().onPrimaryPress!())

    expect(queryByText('Hecho')).toBeNull()
  })
})

// useFeedback no usa hooks de React por dentro, así que se puede llamar fuera de un componente en el test.
const useFeedbackApi = useFeedback
