import type { ComponentProps } from 'react'
import type { ViewProps } from 'react-native'
import type LottieView from 'lottie-react-native'

export interface LoadingViewProps extends ViewProps {
  title: string
  description: string
  /** Color de fondo. Default `#ffffff`. */
  background?: string
  /** Animación Lottie (iOS/web). Default: `dots-loader.json` del registry. En Android se muestra el Spinner. */
  source?: ComponentProps<typeof LottieView>['source']
  className?: string
  testID?: string
}
