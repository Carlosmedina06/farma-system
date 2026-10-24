import { RefObject } from 'react'
import { type TextInputInstance } from 'react-native'

export interface CodeInputMountedInfo {
  /** Cantidad de dígitos del código (`length`). */
  maxLength: number
}

export interface CodeInputErrorInfo {
  /** Valor que quedó luego de descartar los caracteres no numéricos. */
  attemptedValue: string
  /** Texto original recibido del TextInput. */
  rawValue: string
}

export interface CodeInputAutofillInfo {
  /** Ms desde el montaje (o desde el último reseteo del valor) hasta completar. */
  elapsedMs: number
}

export interface CodeInputCompleteInfo {
  code: string
  /** `true` si el código se completó de una sola vez (autofill / pegado). */
  autofill: boolean
  elapsedMs: number
}

export interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  /** Cantidad de dígitos. */
  length: number
  errorText?: string
  hasError?: boolean
  onFocus?: () => void
  /** Primer focus del input (una sola vez por montaje). */
  onMounted?: (info: CodeInputMountedInfo) => void
  /** Se ingresaron caracteres no numéricos y fueron descartados. */
  onError?: (error: CodeInputErrorInfo) => void
  /** El código se completó por autofill/pegado (antes de `onComplete`). */
  onAutofill?: (info: CodeInputAutofillInfo) => void
  /**
   * El código alcanzó `length` dígitos. Se dispara una vez por ciclo: vuelve a
   * habilitarse cuando el padre limpia el valor (`value=""`).
   */
  onComplete?: (info: CodeInputCompleteInfo) => void
  className?: string
  testID?: string
  inputRef?: RefObject<TextInputInstance | null>
}
