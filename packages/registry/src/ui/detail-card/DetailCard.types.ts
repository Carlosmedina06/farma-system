import { ReactNode } from 'react'
import { ViewProps } from 'react-native'

import { type IconName } from '@farma/registry/ui/icon'

export interface DetailCardItemProps {
  label: string
  description?: string
  additionalDescription?: string
  caption?: string
  icon?: IconName
  /** Muestra la leyenda `noCostLabel` ("Sin costo") debajo del ítem. */
  noCost?: boolean
}

export interface DetailCardProps extends ViewProps {
  title: string
  itemsList: DetailCardItemProps[]
  /** Texto del botón (textLink) de la cabecera. Se ignora si `showEdit`. */
  buttonText?: string
  borderColor?: string
  isListLight?: boolean
  /** Acción del botón de la cabecera (lápiz o textLink). */
  onPress?: () => void
  /** Muestra un icono de lápiz en la cabecera en lugar de `buttonText`. */
  showEdit?: boolean
  editAccessibilityLabel?: string
  isLoading?: boolean
  /** Separador entre ítems. */
  divider?: boolean
  /** Texto para los ítems con `noCost`. Por defecto "Sin costo". */
  noCostLabel?: string
  /** Pone en mayúscula la primera letra de los textos de cada ítem (por defecto `true`). */
  upperFirst?: boolean
  /** Contenido al pie de la tarjeta, debajo de un separador (p. ej. una dirección). Con `isLoading` se muestra un skeleton. */
  footer?: ReactNode
  className?: string
  testID?: string
}
