import type { ImageContentFit, ImageSource, ImageStyle } from 'expo-image'
import type { ViewProps } from 'react-native'

/**
 * Cache opcional de URLs que ya fallaron. Permite no volver a pegarle a la red por una
 * imagen rota (p. ej. persistido en AsyncStorage/MMKV con TTL). `has` puede ser async.
 */
export interface FailedImageCache {
  has(uri: string): boolean | Promise<boolean>
  add(uri: string): void
}

export interface OptimizedImageProps extends Omit<ViewProps, 'style'> {
  url?: string | null
  width?: number | string
  height?: number | string
  borderRadius?: number
  resizeMode?: ImageContentFit
  style?: ImageStyle
  /** Imagen a mostrar si `url` falta, es inválida o falla. Sin default: si no se pasa, no se muestra nada. */
  fallbackSource?: ImageSource | number
  /** Cache inyectable de URLs fallidas (ver `FailedImageCache`). */
  failedCache?: FailedImageCache
  onLoad?: () => void
  onError?: () => void
  className?: string
  testID?: string
}

export const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }
  try {
    new URL(url)

    return true
  } catch {
    return url.startsWith('http://') || url.startsWith('https://')
  }
}
