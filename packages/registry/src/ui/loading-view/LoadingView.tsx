import type { FC } from 'react'
import { Platform, View } from 'react-native'
import LottieView from 'lottie-react-native'
import dotsLoader from '@farma/assets/lottie/dots-loader.json'
import { Spinner } from '@farma/registry/ui/spinner'
import { Text } from '@farma/registry/ui/text'
import { getWP } from '@farma/registry/lib/dimensions'
import { cn } from '@farma/registry/lib/utils'

import type { LoadingViewProps } from './LoadingView.types'

/** Pantalla de carga: animación de puntos (Spinner en Android) + título y descripción. */
export const LoadingView: FC<LoadingViewProps> = ({
  title,
  description,
  background = '#ffffff',
  source = dotsLoader,
  className,
  testID,
  style,
  ...restProps
}) => {
  const isAndroid = Platform.OS === 'android'

  return (
    <View
      className={cn('flex-1 items-center justify-center', className)}
      style={[{ backgroundColor: background }, style]}
      testID={testID}
      {...restProps}
    >
      {isAndroid ? (
        <View className="flex-[0.5] justify-center">
          <Spinner size="3xl" />
        </View>
      ) : (
        <LottieView autoPlay loop source={source} style={{ width: getWP(100), height: getWP(60) }} />
      )}

      <View className="flex-[0.2] items-center gap-1">
        {!!title && <Text type="h3">{title}</Text>}
        {!!description && (
          <Text className="text-gray-600" type="body2">
            {description}
          </Text>
        )}
      </View>
    </View>
  )
}

export default LoadingView
