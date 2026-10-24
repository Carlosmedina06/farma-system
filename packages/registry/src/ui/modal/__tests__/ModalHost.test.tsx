import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { act, renderHook, render } from '@testing-library/react-native'

import { ModalHost, modal, useCurrentModal, useModal } from '../ModalHost'

jest.mock('../Modal', () => {
  const { Text, View } = require('react-native')
  return {
    Modal: ({ visible, title, close, testID }: any) =>
      visible ? (
        <View testID={testID}>
          <Text>{title}</Text>
          <Text testID="close" onPress={close}>
            x
          </Text>
        </View>
      ) : null,
  }
})

describe('ModalHost', () => {
  afterEach(() => {
    act(() => modal.hide())
  })

  it('no muestra nada sin un modal activo', () => {
    const { queryByTestId } = render(<ModalHost />)

    expect(queryByTestId('modal')).toBeNull()
  })

  it('muestra y oculta con modal.show / modal.hide', () => {
    const { getByText, queryByTestId } = render(<ModalHost />)

    act(() => modal.show({ title: 'Hola' }))
    expect(getByText('Hola')).toBeTruthy()

    act(() => modal.hide())
    expect(queryByTestId('modal')).toBeNull()
  })

  it('close del Modal oculta el modal', () => {
    const { getByTestId, queryByTestId } = render(<ModalHost />)

    act(() => modal.show({ title: 'Hola', testID: 'mi-modal' }))
    act(() => getByTestId('close').props.onPress())

    expect(queryByTestId('mi-modal')).toBeNull()
  })

  it('useModal mantiene la API { showModal, hideModal }', () => {
    const { result } = renderHook(() => ({ api: useModal(), current: useCurrentModal() }))

    act(() => result.current.api.showModal({ title: 'Desde el hook' }))
    expect(result.current.current?.title).toBe('Desde el hook')
    expect(modal.current?.title).toBe('Desde el hook')

    act(() => result.current.api.hideModal())
    expect(result.current.current).toBeUndefined()
  })
})
