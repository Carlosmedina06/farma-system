import type { ViewProps } from 'react-native'

export interface TypingIndicatorProps extends ViewProps {
  /** Texto junto a la animación. Default: "Escribiendo...". */
  label?: string
  /** Nombre que se muestra arriba de la burbuja (p. ej. "Operador"). Si se omite no hay cabecera. */
  senderName?: string
  /** Clases de la burbuja. */
  className?: string
  /** Clases del contenedor externo (solo cuando hay `senderName`). */
  containerClassName?: string
  testID?: string
}
