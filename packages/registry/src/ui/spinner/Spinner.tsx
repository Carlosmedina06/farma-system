import LottieView from 'lottie-react-native'
import { View, ViewProps } from 'react-native'

import { cn } from '@farma/registry/lib/utils'

import { SpinnerProps, sizeMapper, spinnerColor } from './Spinner.types'

export const Spinner = ({
  color = 'blue',
  size = 'xl',
  className,
  testID,
  position = 'relative',
  ...props
}: SpinnerProps & ViewProps) => {
  const resolvedSize = typeof size === 'string' ? sizeMapper[size] : size

  return (
    <View
      {...props}
      className={cn(
        'h-5 items-center justify-center',
        position === 'absolute' && 'absolute',
        className,
      )}
      testID={testID}
    >
      <LottieView
        autoPlay
        loop
        source={spinnerColor[color]}
        style={{
          width: resolvedSize || 25,
          height: resolvedSize || 25,
        }}
      />
    </View>
  )
}
