import type { ViewProps } from 'react-native'
import type { TextProps } from '@farma/registry/ui/text'

export type TextAlign = 'left' | 'right' | 'center'

export interface TextWithBoldProps extends ViewProps {
  /** Texto con segmentos en negrita delimitados por `#**…**#`. */
  text: string
  textAlign?: TextAlign
  /** Clase de color aplicada a cada segmento (p. ej. `text-gray-600`). */
  textColor?: string
  textType: TextProps['type']
  className?: string
  testID?: string
}

export interface ParseTextProps extends TextWithBoldProps {
  position: number
}

export const TextAlignMapper: { [key in TextAlign]: 'flex-start' | 'flex-end' | 'center' } = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
}
