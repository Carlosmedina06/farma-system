import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { Icon } from '@farma/registry/ui/icon'

import { ToastHost, ToastType, showToast, toast } from '../toast'

jest.mock('react-native-toast-message', () => {
  const { View } = require('react-native')
  const MockToast = Object.assign(
    ({ config, topOffset, bottomOffset }: any) => {
      const Default = config.Default
      return (
        <View testID="toast-root" {...{ topOffset, bottomOffset }}>
          <Default props={(globalThis as any).__toastViewProps ?? { text: 'desde el host', type: 'Default' }} />
        </View>
      )
    },
    { show: jest.fn(), hide: jest.fn() },
  )
  return { __esModule: true, default: MockToast }
})

describe('toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('toast.show llama a Toast.show con el texto y el tipo', () => {
    toast.show({ text: 'Hola', type: ToastType.Success, withIcon: true })

    expect(Toast.show).toHaveBeenCalledWith({
      type: ToastType.Success,
      props: { text: 'Hola', type: ToastType.Success, withIcon: true },
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      swipeable: false,
    })
  })

  it('usa Default y respeta duration y position', () => {
    showToast({ text: 'Hola', duration: 1000, position: 'bottom' })

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: ToastType.Default, visibilityTime: 1000, position: 'bottom' }),
    )
  })

  it('no pasa duration ni position a la vista', () => {
    toast.show({ text: 'Hola', duration: 1000, position: 'bottom' })

    const { props } = (Toast.show as jest.Mock).mock.calls[0]![0] as { props: Record<string, unknown> }
    expect(props).not.toHaveProperty('duration')
    expect(props).not.toHaveProperty('position')
  })

  it('ToastHost pasa los offsets y se cierra con Toast.hide', () => {
    const { getByTestId } = render(<ToastHost bottomOffset={40} topOffset={120} />)

    expect(getByTestId('toast-root').props).toMatchObject({ topOffset: 120, bottomOffset: 40 })
    fireEvent.press(getByTestId('toast'))
    expect(Toast.hide).toHaveBeenCalled()
  })

  it('acepta className para el contenedor e iconSize para el ícono', () => {
    ;(globalThis as any).__toastViewProps = {
      text: 'Eliminaste un producto',
      type: ToastType.Default,
      withIcon: true,
      iconSize: 18,
      className: 'mx-padding-xl',
    }
    const { getByTestId, UNSAFE_getByType } = render(<ToastHost />)
    delete (globalThis as any).__toastViewProps

    const className = getByTestId('toast').props.className as string
    expect(className).toContain('mx-padding-xl')
    expect(className).not.toContain('mx-padding-4xl')
    expect(UNSAFE_getByType(Icon).props.size).toBe(18)
  })
})
