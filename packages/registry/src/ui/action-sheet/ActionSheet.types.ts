import { ReactNode } from 'react'

import { type IconName } from '@farma/registry/ui/icon'

export type ActionSheetOption = {
  /** Identificador único; también se usa para el testID (`${testID}-${key}`). */
  key: string
  label: string
  icon?: IconName
  /** Texto secundario debajo del label. */
  description?: string
  onPress: () => void | Promise<void>
  disabled?: boolean
  testID?: string
}

export type ActionSheetProps = {
  open: boolean
  close: () => void
  options: ActionSheetOption[]
  title?: string
  /** Nota informativa al pie de las opciones (con icono `descriptionIcon`). */
  description?: string
  /** Icono de la nota. Por defecto `info-circle`. */
  descriptionIcon?: IconName
  /** Contenido libre al pie (debajo de `description`). */
  footer?: ReactNode
  /** Llama a `close` después de `onPress` de una opción (por defecto `false`). */
  closeOnSelect?: boolean
  className?: string
  testID?: string
}
