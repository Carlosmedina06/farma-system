import type { IconName } from '@farma/registry/ui/icon'

export enum SnackbarType {
  Success = 'Success',
  Error = 'Error',
  Default = 'Default',
  /** Fondo neutro con ícono de éxito. */
  DefaultSuccess = 'DefaultSuccess',
}

export type SnackbarProps = {
  text?: string
  type?: SnackbarType
  actionText?: string
  onPressAction?: () => void
  withIcon?: boolean
  withCloseIcon?: boolean
  /** Ícono a mostrar con `withIcon`; por defecto depende de `type`. */
  icon?: IconName
  /** Se llama al tocar el snackbar o la X. */
  onClose?: () => void
  /** Etiqueta de accesibilidad del botón de cerrar. */
  closeLabel?: string
  className?: string
  testID?: string
}
