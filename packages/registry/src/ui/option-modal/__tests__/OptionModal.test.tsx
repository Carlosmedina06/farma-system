import { describe, expect, it, jest } from '@jest/globals'
import { act, fireEvent, render } from '@testing-library/react-native'

import { OptionModal } from '../OptionModal'
import { OptionModalHost, optionModal, useOptionModal } from '../OptionModalHost'

const OPTIONS = [
  { label: 'Opción A', value: 'a' },
  { label: 'Otro', value: 'other' },
]
const FREE_TEXT = { value: 'other', minLength: 10, errorText: 'Escribí al menos 10 caracteres' }

const renderModal = (props: Partial<Parameters<typeof OptionModal>[0]> = {}) =>
  render(
    <OptionModal
      visible
      options={OPTIONS}
      primaryAction={{ children: 'Enviar' }}
      title="Elegí una opción"
      {...props}
    />,
  )

const isDisabled = (element: { props: { accessibilityState?: { disabled?: boolean }; disabled?: boolean } }) =>
  element.props.accessibilityState?.disabled ?? element.props.disabled

describe('OptionModal', () => {
  it('no renderiza nada si no es visible', () => {
    const { queryByText } = renderModal({ visible: false })

    expect(queryByText('Elegí una opción')).toBeNull()
  })

  it('renderiza título y opciones', () => {
    const { getByText } = renderModal()

    expect(getByText('Elegí una opción')).toBeTruthy()
    expect(getByText('Opción A')).toBeTruthy()
  })

  it('deshabilita el botón principal hasta elegir una opción', () => {
    const { getByTestId } = renderModal()

    expect(isDisabled(getByTestId('option-modal-primary-button'))).toBe(true)
    fireEvent.press(getByTestId('option-modal-option-a'))
    expect(isDisabled(getByTestId('option-modal-primary-button'))).toBe(false)
  })

  it('avisa la selección con onSelectOption', () => {
    const onSelectOption = jest.fn()
    const { getByTestId } = renderModal({ onSelectOption })

    fireEvent.press(getByTestId('option-modal-option-a'))

    expect(onSelectOption).toHaveBeenCalledWith(OPTIONS[0])
  })

  it('sin freeTextOption, "Otro" es una opción común', () => {
    const { getByTestId, queryByTestId } = renderModal()

    fireEvent.press(getByTestId('option-modal-option-other'))

    expect(queryByTestId('option-modal-other-input')).toBeNull()
  })

  it('con freeTextOption pide texto y valida el mínimo', () => {
    const { getByTestId, getByText, queryByText } = renderModal({ freeTextOption: FREE_TEXT })

    fireEvent.press(getByTestId('option-modal-option-other'))
    expect(getByText('Escribí al menos 10 caracteres')).toBeTruthy()
    expect(isDisabled(getByTestId('option-modal-primary-button'))).toBe(true)

    fireEvent.changeText(getByTestId('option-modal-other-input'), 'un motivo suficientemente largo')
    expect(queryByText('Escribí al menos 10 caracteres')).toBeNull()
    expect(isDisabled(getByTestId('option-modal-primary-button'))).toBe(false)
  })

  it('respeta la selección controlada', () => {
    const { getByTestId } = renderModal({ selectedOption: OPTIONS[0] })

    expect(isDisabled(getByTestId('option-modal-primary-button'))).toBe(false)
  })

  it('llama close al tocar el fondo', () => {
    const close = jest.fn()
    const { getByTestId } = renderModal({ close })

    fireEvent.press(getByTestId('option-modal-overlay'))

    expect(close).toHaveBeenCalled()
  })
})

describe('OptionModalHost', () => {
  it('muestra el modal y expone la selección por useOptionModal', () => {
    const result = { current: undefined as unknown as ReturnType<typeof useOptionModal> }
    function Probe() {
      result.current = useOptionModal()
      return null
    }
    const { getByTestId, queryByText } = render(
      <>
        <OptionModalHost />
        <Probe />
      </>,
    )

    act(() => result.current.showModal({ title: 'Motivo', options: OPTIONS }))
    fireEvent.press(getByTestId('option-modal-option-a'))
    expect(result.current.selectedOption).toEqual(OPTIONS[0])
    expect(optionModal.selectedOption).toEqual(OPTIONS[0])

    act(() => result.current.hideModal())
    expect(queryByText('Motivo')).toBeNull()
    expect(result.current.selectedOption).toBeUndefined()
  })
})
