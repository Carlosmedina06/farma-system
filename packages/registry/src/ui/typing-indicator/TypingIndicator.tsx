import LottieView from 'lottie-react-native'
import { View } from 'react-native'

import dotsLoading from '@farma/assets/lottie/dots-loading.json'
import { cn } from '@farma/registry/lib/utils'
import { Text } from '@farma/registry/ui/text'

import type { TypingIndicatorProps } from './TypingIndicator.types'

const DEFAULT_LABEL = 'Escribiendo...'

export const TypingIndicator = ({
  label = DEFAULT_LABEL,
  senderName,
  className,
  containerClassName,
  testID,
  ...props
}: TypingIndicatorProps) => {
  const bubble = (
    <View
      {...(senderName ? {} : props)}
      accessibilityLabel={senderName ? undefined : (props.accessibilityLabel ?? label)}
      className={cn(
        'gap-gap-sm px-padding-lg py-padding-xl flex-row items-center self-start rounded-sm rounded-tl-none border border-gray-200 bg-gray-100',
        className,
      )}
      testID={senderName ? (testID ? `${testID}-bubble` : undefined) : testID}
    >
      <Text className="text-gray-600" type="caption">
        {label}
      </Text>

      <LottieView autoPlay loop source={dotsLoading} style={{ width: 20, height: 10 }} />
    </View>
  )

  if (!senderName) return bubble

  return (
    <View
      {...props}
      accessibilityLabel={props.accessibilityLabel ?? `${senderName} ${label}`}
      className={cn('gap-gap-xxs pr-padding-2xl w-auto', containerClassName)}
      testID={testID}
    >
      <Text semibold type="body2">
        {senderName}
      </Text>
      {bubble}
    </View>
  )
}
