import Toast, { type ToastConfig } from 'react-native-toast-message'

import { Snackbar, SnackbarType, type SnackbarProps } from '@farma/registry/ui/snackbar'

export type ShowToastProps = Omit<SnackbarProps, 'onClose'> & {
  position?: 'top' | 'bottom'
  /** Milisegundos visible. Default 4000. */
  duration?: number
}

const DEFAULT_DURATION = 4000

const toastConfig: ToastConfig = Object.fromEntries(
  Object.values(SnackbarType).map((type) => [
    type,
    ({ props }: { props: SnackbarProps }) => <Snackbar {...props} onClose={() => Toast.hide()} />,
  ]),
)

export type ToastHostProps = {
  /** Distancia desde arriba para `position: 'top'` (ej. alto del header de la app). */
  topOffset?: number
  /** Distancia desde abajo para `position: 'bottom'`. */
  bottomOffset?: number
}

/**
 * Capa imperativa OPCIONAL sobre `Snackbar`. Montá un `<ToastHost />` una vez en el root
 * y llamá `toast.show()` desde cualquier lado. Sin host, `toast.show()` no hace nada.
 */
export function ToastHost({ topOffset, bottomOffset }: ToastHostProps) {
  return <Toast bottomOffset={bottomOffset} config={toastConfig} position="top" topOffset={topOffset} />
}

export const toast = {
  show({ type = SnackbarType.Default, position = 'top', duration, ...snackbarProps }: ShowToastProps) {
    Toast.show({
      type,
      props: { ...snackbarProps, type },
      position,
      visibilityTime: duration ?? DEFAULT_DURATION,
      autoHide: true,
      swipeable: false,
    })
  },
  hide() {
    Toast.hide()
  },
}

/** Alias compatible con la API anterior de app-mobile. */
export const showToast = toast.show
