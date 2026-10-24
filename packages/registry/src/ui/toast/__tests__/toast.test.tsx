import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'
import Toast from 'react-native-toast-message'

import { SnackbarType } from '@farma/registry/ui/snackbar'

import { ToastHost, showToast, toast } from '../toast'

jest.mock('react-native-toast-message', () => {
  const { View } = require('react-native')
  const MockToast = Object.assign(
    ({ config, topOffset, bottomOffset }: any) => {
      const Default = config.Default
      return (
        <View testID="toast-root" {...{ topOffset, bottomOffset }}>
          <Default props={{ text: 'desde el host', type: 'Default' }} />
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

  it('toast.show llama a Toast.show con los props del Snackbar', () => {
    toast.show({ text: 'Hola', type: SnackbarType.Success, withIcon: true })

    expect(Toast.show).toHaveBeenCalledWith({
      type: SnackbarType.Success,
      props: { text: 'Hola', type: SnackbarType.Success, withIcon: true },
      position: 'top',
      visibilityTime: 4000,
      autoHide: true,
      swipeable: false,
    })
  })

  it('usa Default y respeta duration y position', () => {
    showToast({ text: 'Hola', duration: 1000, position: 'bottom' })

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: SnackbarType.Default, visibilityTime: 1000, position: 'bottom' }),
    )
  })

  it('no pasa duration ni position al Snackbar', () => {
    toast.show({ text: 'Hola', duration: 1000, position: 'bottom' })

    const { props } = (Toast.show as jest.Mock).mock.calls[0]![0] as { props: Record<string, unknown> }
    expect(props).not.toHaveProperty('duration')
    expect(props).not.toHaveProperty('position')
  })

  it('ToastHost pasa los offsets y el Snackbar se cierra con Toast.hide', () => {
    const { getByTestId } = render(<ToastHost bottomOffset={40} topOffset={120} />)

    expect(getByTestId('toast-root').props).toMatchObject({ topOffset: 120, bottomOffset: 40 })
    fireEvent.press(getByTestId('snackbar'))
    expect(Toast.hide).toHaveBeenCalled()
  })
})
