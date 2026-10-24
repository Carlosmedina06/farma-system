import type { InputProps } from '@farma/registry/ui/input'

export const EMAIL_DOMAINS = ['@gmail.com', '@hotmail.com', '@yahoo.com', '@outlook.com'] as const

export interface EmailInputProps extends InputProps {
  onSelectDomain?: (domain: string) => void
  onDropdownToggle?: (show: boolean) => void
  isValid?: boolean
  /** Dominios sugeridos al escribir `@` (con el `@` incluido). Por defecto `EMAIL_DOMAINS`. */
  domains?: readonly string[]
}
