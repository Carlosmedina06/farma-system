import { StatusBar } from 'expo-status-bar'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { FadeInDown, FadeOutUp, useReducedMotion } from 'react-native-reanimated'
import { Button } from '@farma/registry/ui/button'
import { FeaturedIcon } from '@farma/registry/ui/featured-icon'
import { Text } from '@farma/registry/ui/text'

import type { AttemptLimitModalProps } from './AttemptLimitModal.types'

/** Pantalla completa (overlay) de bloqueo: ícono, título, descripción y un botón. Controlada por `visible`. */
export const AttemptLimitModal = ({
  visible,
  title,
  description,
  buttonText,
  onButtonPress,
  icon = 'alert-circle',
  iconType = 'warning',
  testID = 'attempt-limit-modal',
}: AttemptLimitModalProps) => {
  const insets = useSafeAreaInsets()
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  if (!visible) {
    return null
  }

  return (
    <>
      <StatusBar style="dark" />
      <Animated.View
        className="bg-base-white absolute inset-0 flex-col justify-between"
        entering={reduceMotion ? undefined : FadeInDown.duration(300)}
        exiting={reduceMotion || isAndroid ? undefined : FadeOutUp.duration(300)}
        testID={testID}
      >
        <View className="gap-gap-xl px-padding-xl flex-1 items-center justify-center">
          <View className="items-center justify-center">
            <FeaturedIcon outline icon={icon} type={iconType} />
          </View>

          <View className="gap-gap-xs w-[90%] items-center">
            <Text semibold className="text-center text-gray-800" testID={`${testID}-title`} type="h1">
              {title}
            </Text>
            {description != null && description !== '' ? (
              <Text className="text-center text-gray-800" testID={`${testID}-description`} type="body1">
                {description}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          className="gap-gap-sm px-padding-xl pt-padding-sm"
          style={{ paddingBottom: insets.bottom || 16 }}
        >
          <Button full size="xl" testID={`${testID}-button`} type="primary" onPress={onButtonPress}>
            {buttonText}
          </Button>
        </View>
      </Animated.View>
    </>
  )
}

export default AttemptLimitModal
