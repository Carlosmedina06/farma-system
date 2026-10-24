import type { ReactNode } from 'react'
import type { ViewProps } from 'react-native'

export type ChatBubbleDirection = 'incoming' | 'outgoing'

export type ChatAttachmentType = 'image' | 'pdf' | 'file'

export interface ChatAttachment {
  /** Nombre visible del archivo (se usa en el tile de pdf/archivo y en accesibilidad). */
  name: string
  type: ChatAttachmentType
  /** URI ya resuelta (http, file:// o data:). Para `image` se dibuja como miniatura. */
  uri?: string
}

export interface ChatBubbleProps extends ViewProps {
  /**
   * `incoming`: burbuja alineada a la derecha, fondo primary-100, con check de leído
   * (equivale a `IncomingMessage` de app-mobile).
   * `outgoing`: burbuja alineada a la izquierda, fondo gris, con `senderName` arriba
   * (equivale a `OutcomingMessage`).
   */
  direction: ChatBubbleDirection
  /** Texto del mensaje. */
  text?: string
  /** Hora ya formateada. */
  time?: string
  /** Solo `incoming`: muestra el check azul (leído) o gris (no leído). */
  read?: boolean
  /** Solo `incoming`: oculta el check de leído. Default `true`. */
  showReadStatus?: boolean
  /** Solo `outgoing`: nombre arriba de la burbuja (p. ej. "Operador"). */
  senderName?: string
  /** Pinta el texto como link (azul). */
  isLink?: boolean
  /** Adjunto del mensaje. La app resuelve la descarga y pasa la `uri`. */
  attachment?: ChatAttachment
  /** Muestra un skeleton en lugar del adjunto mientras se descarga. */
  loading?: boolean
  /** Solo `outgoing`: reemplaza la burbuja por el indicador "Escribiendo...". */
  typing?: boolean
  /** Texto del indicador de escritura. Default: "Escribiendo...". */
  typingLabel?: string
  /** Se llama con el texto al tocar la burbuja de texto. */
  onPress?: (text: string) => void
  /** Se llama al tocar el adjunto (p. ej. para abrir una previsualización). */
  onPressAttachment?: (attachment: ChatAttachment) => void
  /** Reemplaza el render por defecto del adjunto (p. ej. un visor de PDF). */
  renderAttachment?: (attachment: ChatAttachment) => ReactNode
  className?: string
  testID?: string
}
