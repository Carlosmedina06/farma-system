import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

export interface EmptyStateProps extends ViewProps {
  /** Ilustración (slot). Sin default: si no se pasa no se renderiza nada. */
  illustration?: ReactNode
  content?: {
    title: string
    label?: string
  }
  className?: string
  testID?: string
}
