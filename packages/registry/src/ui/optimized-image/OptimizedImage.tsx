import { useEffect, useState } from 'react'
import { View, type DimensionValue } from 'react-native'
import { cn } from '@farma/registry/lib/utils'
import { Spinner } from '@farma/registry/ui/spinner'
import { UniwindImage } from '@farma/registry/ui/uniwind-image'

import { type FailedImageCache, OptimizedImageProps, isValidUrl } from './OptimizedImage.types'

/**
 * `true`/`false` si el cache ya respondió; `undefined` mientras una respuesta async está pendiente.
 */
const useKnownFailed = (url: string | null | undefined, failedCache?: FailedImageCache) => {
  const [state, setState] = useState<{ url?: string | null; failed?: boolean }>(() => {
    if (!url || !failedCache) return { url, failed: false }
    const result = failedCache.has(url)

    return typeof result === 'boolean' ? { url, failed: result } : { url, failed: undefined }
  })

  useEffect(() => {
    let cancelled = false

    if (!url || !failedCache) {
      setState({ url, failed: false })

      return
    }

    const result = failedCache.has(url)

    if (typeof result === 'boolean') {
      setState({ url, failed: result })
    } else {
      setState({ url, failed: undefined })
      result
        .then((failed) => !cancelled && setState({ url, failed }))
        .catch(() => !cancelled && setState({ url, failed: false }))
    }

    return () => {
      cancelled = true
    }
  }, [url, failedCache])

  return state.url === url ? state.failed : undefined
}

const OptimizedImage = ({
  url,
  width,
  height,
  borderRadius = 0,
  resizeMode = 'cover',
  style,
  fallbackSource,
  failedCache,
  onLoad,
  onError,
  className,
  testID,
  ...viewProps
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (url) {
      setIsLoading(true)
      setHasError(false)
    } else {
      setIsLoading(false)
      setHasError(true)
    }
  }, [url])

  const knownFailed = useKnownFailed(url, failedCache)
  const isCheckingCache = knownFailed === undefined
  const hasValidUrl = isValidUrl(url)
  // Si la url ya falló según el cache, se usa el fallback sin intentar la red.
  const shouldUseFallback = !hasValidUrl || hasError || knownFailed === true
  const remoteSource = shouldUseFallback || isCheckingCache ? undefined : { uri: url as string }
  const source = shouldUseFallback ? fallbackSource : remoteSource

  const handleLoadEnd = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    // La url real falló → se muestra el fallback y se registra en el cache (si hay uno).
    if (url && !shouldUseFallback) failedCache?.add(url)
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const showSpinner = !shouldUseFallback && (isLoading || isCheckingCache)

  return (
    <View
      {...viewProps}
      className={cn('relative overflow-hidden', className)}
      style={{ width: width as DimensionValue, height: height as DimensionValue }}
      testID={testID}
    >
      {showSpinner && (
        <View className="absolute inset-0 z-1 items-center justify-center">
          <Spinner size="md" />
        </View>
      )}

      {source != null && (
        <UniwindImage
          cachePolicy="memory-disk"
          contentFit={resizeMode}
          recyclingKey={url || undefined}
          source={source}
          style={[
            {
              borderRadius,
              height: '100%',
              width: '100%',
            },
            style,
          ]}
          testID={testID ? `${testID}-image` : 'optimized-image-image'}
          transition={200}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
        />
      )}
    </View>
  )
}

export default OptimizedImage
