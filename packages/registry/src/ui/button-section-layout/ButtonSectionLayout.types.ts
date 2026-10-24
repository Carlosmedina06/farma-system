import type { ReactNode } from 'react'
import type { AccessibilityProps, ViewProps } from 'react-native'
import type { ButtonProps } from '@farma/registry/ui/button'
import type { IconName } from '@farma/registry/ui/icon'

export type ButtonSectionVariant =
  | 'horizontalTwoButtons'
  | 'horizontalTwoButtonsFilters'
  | 'verticalTwoButtons'
  | 'verticalPrimaryWithLinkPrompt'
  | 'verticalSingleButton'
  | 'verticalSingleButtonWithAmount'
  | 'verticalTwoButtonsWithAmount'
  | 'verticalTwoButtonsWithSummary'
  | 'verticalSingleButtonWithText'
  | 'verticalSingleButtonWithHeader'
  | 'actionSlotWithButton'

export interface ButtonLayoutProps extends ButtonProps, AccessibilityProps {
  id?: string
}

export interface ActionSlotContext {
  /** Alto de la fila de acciones, para que el slot iguale al botón. */
  height: number
}

export interface ButtonSectionProps extends ViewProps {
  variant?: ButtonSectionVariant
  orientation?: 'horizontal' | 'vertical'
  /** Etiqueta del monto (izquierda). En `verticalSingleButtonWithText` es el valor de la derecha. */
  amountText?: ReactNode
  amountCaption?: ReactNode
  /**
   * Monto. Si es numérico (number o string numérica) se formatea con `formatAmount`;
   * si no, se muestra tal cual en las variantes que lo permiten.
   */
  amountValue?: ReactNode
  /** Formatea montos numéricos. Default: `value.toLocaleString('es-AR')`. */
  formatAmount?: (value: number) => string
  /** Etiqueta izquierda de `verticalSingleButtonWithText`. Default: "Total". */
  amountLabel?: ReactNode
  primaryButton?: ButtonLayoutProps
  secondaryButton?: ButtonLayoutProps
  /** Texto previo al link en `verticalPrimaryWithLinkPrompt` (el link es `secondaryButton.children`). */
  promptText?: ReactNode
  /** Encabezado de `verticalSingleButtonWithHeader`. */
  headerTitle?: ReactNode
  headerCaption?: ReactNode
  headerIcon?: IconName
  /** Slot a la izquierda del botón primario en `actionSlotWithButton` (35% del ancho). */
  renderAction?: (context: ActionSlotContext) => ReactNode
  isLoading?: boolean
  className?: string
  testID?: string
}
