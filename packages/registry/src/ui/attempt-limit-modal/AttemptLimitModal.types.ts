import type { ReactNode } from 'react'
import type { FeaturedIconType } from '@farma/registry/ui/featured-icon'
import type { IconName } from '@farma/registry/ui/icon'

export interface AttemptLimitModalProps {
  /** Controla la visibilidad (componente controlado). */
  visible: boolean
  /** Título principal. */
  title: string
  /** Texto debajo del título (p. ej. "Volvé a probar en 10:00."). */
  description?: ReactNode
  /** Texto del botón principal. */
  buttonText: string
  /** Acción del botón principal. */
  onButtonPress: () => void
  /** Ícono del FeaturedIcon. Default `alert-circle`. */
  icon?: IconName
  /** Variante de color del FeaturedIcon. Default `warning`. */
  iconType?: FeaturedIconType
  testID?: string
}
