import React from 'react'
import { Platform, View } from 'react-native'
import { type EdgeInsets } from 'react-native-safe-area-context'
import { UniwindSafeAreaView } from '@farma/registry/ui/safe-area-view'
import { StatusBar } from 'expo-status-bar'
import Animated, { useReducedMotion, FadeIn, FadeOut } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { getWP } from '@farma/registry/lib/dimensions'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { Text } from '@farma/registry/ui/text'
import { ButtonSectionLayout } from '@farma/registry/ui/button-section-layout'
import { Portal } from '@farma/registry/ui/portal'
import type { ButtonProps } from '@farma/registry/ui/button'
import type { ButtonSectionVariant } from '@farma/registry/ui/button-section-layout'
import successAnimation from '@farma/assets/lottie/success-animation.json'

interface ModalSuccessAnimatedProps {
  title?: string
  description?: string
  primaryAction?: Omit<ButtonProps, 'size'>
  secondaryAction?: Omit<ButtonProps, 'size'>
  formattedDescription?: React.ReactNode
  insets: EdgeInsets
  variant?: ButtonSectionVariant
}

const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)

export function ModalSuccessAnimated({
  title,
  description,
  primaryAction,
  secondaryAction,
  formattedDescription,
  insets,
  variant,
}: ModalSuccessAnimatedProps): React.ReactNode {
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  const descriptionContent =
    formattedDescription ??
    (description ? (
      <Text className="text-center text-gray-800" type="body1">
        {description}
      </Text>
    ) : null)

  const edges = isAndroid ? 'bottom' : undefined

  return (
    <Portal>
    <UniwindSafeAreaView
      className="absolute top-0 right-0 bottom-0 left-0 flex-1"
      edges={edges ? [edges] : []}
    >
      <AnimatedView
        className="bg-base-white absolute top-0 right-0 bottom-0 left-0"
        entering={reduceMotion ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid ? undefined : FadeOut}
        style={{
          height: '100%',
        }}
      >
        <StatusBar style="light" />
        <AnimatedLayout
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <View className="w-full items-center">
            <View
              className="items-center justify-center"
              style={{ width: getWP(100), height: getWP(100) }}
            >
              <AnimatedLottieView
                autoPlay
                loop={false}
                resizeMode="cover"
                source={successAnimation}
                speed={1}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View className="w-full items-center px-6">
              {title && (
                <Text className="pt-2 pb-1 text-center text-gray-800" type="h1">
                  {title}
                </Text>
              )}
              {descriptionContent}
            </View>
          </View>
          {(primaryAction || secondaryAction) && (
            <View
              className="w-full px-4 pb-4"
              style={{
                paddingBottom: Math.max(insets.bottom, 16),
              }}
            >
              <ButtonSectionLayout
                primaryButton={primaryAction}
                secondaryButton={secondaryAction}
                variant={variant}
              />
            </View>
          )}
        </AnimatedLayout>
      </AnimatedView>
    </UniwindSafeAreaView>
    </Portal>
  )
}
