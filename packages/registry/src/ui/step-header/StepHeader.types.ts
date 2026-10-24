import { ViewProps } from 'react-native'

import { type IconName } from '@farma/registry/ui/icon'

export interface StepHeaderProps extends ViewProps {
  /** Títulos de los pasos, en orden. */
  steps: string[]
  /** Índice (0-based) del paso activo. Los pasos anteriores se muestran como completados. */
  activeStep: number
  /** Si se pasa, se muestra el botón de volver a la izquierda. */
  onBack?: () => void
  backIcon?: IconName
  backAccessibilityLabel?: string
  backAccessibilityHint?: string
  className?: string
  testID?: string
}
