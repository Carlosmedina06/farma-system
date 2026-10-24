import { RefreshControl } from 'react-native'

import type { AppRefreshControlProps } from './AppRefreshControl.types'

/** Colores por defecto (azul primario); cualquier prop los sobreescribe. */
export const defaultRefreshControlAppearance = {
  colorsClassName: 'accent-blue-600',
  progressBackgroundColorClassName: 'accent-white',
  tintColorClassName: 'accent-blue-600',
} as const

/** `RefreshControl` con la apariencia del DS. Acepta todas las props de `RefreshControl`. */
export default function AppRefreshControl(props: Readonly<AppRefreshControlProps>) {
  return <RefreshControl {...defaultRefreshControlAppearance} {...props} />
}
