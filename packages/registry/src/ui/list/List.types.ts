import type { IconName } from '@farma/registry/ui/icon'

interface ListBoldBaseProps {
  label: string
  description?: string
  additionalDescription?: string
  icon: IconName
  capitalize?: boolean
  /** Label en peso regular en lugar de semibold. */
  isListLight?: boolean
  /** Atenúa icono y textos (gris) para indicar un ítem inactivo/no disponible. */
  disabled?: boolean
  /** Texto secundario debajo del label (p. ej. un estado). Se atenúa con `disabled`. */
  subtitle?: string
  /** Texto adicional al final de la columna de textos. */
  footnote?: string
  /** Líneas máximas de `description` (default 3). */
  descriptionNumberOfLines?: number
  /** Clases extra para `description` (p. ej. un ancho fijo `w-[80%]`). */
  descriptionClassName?: string
  className?: string
  testID?: string
}

export interface ListBoldPropsWithCaption extends ListBoldBaseProps {
  caption?: string | (() => string)
  textLinkLabel?: never
  onTextLinkPress?: never
  rightIcon?: IconName
}

export interface ListBoldPropsWithTextLink extends ListBoldBaseProps {
  caption?: never
  textLinkLabel: string
  onTextLinkPress?: () => void
  rightIcon?: never
}

export type ListBoldProps = ListBoldPropsWithCaption | ListBoldPropsWithTextLink

export interface ListIconProps {
  label: string
  description?: string
  icon: IconName
  className?: string
  testID?: string
}

export interface ListSingleLineProps {
  label: string
  description?: string
  className?: string
  testID?: string
}
