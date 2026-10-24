import { ReactNode } from 'react'
import { ViewProps } from 'react-native'

import { type IconName } from '@farma/registry/ui/icon'

export interface ActionProps {
  name?: IconName
  /** Reemplaza el icono por cualquier nodo (p. ej. un icono con alerta). */
  customIcon?: ReactNode
  onPress: () => void
  /** Número del badge sobre el icono (oculto si es 0/undefined). */
  amount?: number
  accessibilityLabel?: string
}

export interface HeaderProps extends ViewProps {
  title?: string
  actions?: ActionProps[]
  /** Nodo libre a la derecha, después de las acciones. */
  rightAction?: ReactNode
  /** Si se pasa, se muestra el botón volver y se usa en el botón atrás de Android. */
  onBack?: () => void
  backIcon?: IconName
  backIconSize?: number
  backAccessibilityLabel?: string
  backAccessibilityHint?: string
  /** Se muestra en lugar del título cuando no hay `title` (p. ej. el logo de la marca). */
  logo?: ReactNode
  /** Contenido debajo de la barra (p. ej. un `StepHeader`). */
  subHeader?: ReactNode
  /** Oculta la barra superior y deja solo `subHeader` (el botón atrás de Android sigue activo). */
  hideTopBar?: boolean
  /**
   * Botón atrás de Android. Por defecto `true`: llama a `onBack` y consume el evento.
   * Con `false` no se registra y el sistema maneja el back.
   */
  handleHardwareBack?: boolean
  /** Reemplaza el comportamiento del botón atrás de Android. Devuelve `false` para no consumir el evento. */
  onHardwareBack?: () => boolean | void
  className?: string
  testID?: string
}
