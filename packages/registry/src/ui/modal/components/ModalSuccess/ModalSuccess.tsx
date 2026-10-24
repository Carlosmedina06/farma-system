import React from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Animated, { useReducedMotion, FadeIn, FadeOut } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { Icon } from '@farma/registry/ui/icon'
import { cn } from '@farma/registry/lib/utils'

import { ModalContent } from '../ModalContent/ModalContent'
import { ModalActions } from '../ModalActions/ModalActions'
import { ModalProps } from '../../Modal.types'
import successAnimation from '@farma/assets/lottie/success-animation.json'

const AnimatedView = Animated.createAnimatedComponent(View)
const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)

interface ModalSuccessProps extends Pick<
  ModalProps,
  | 'close'
  | 'customClose'
  | 'description'
  | 'formattedDescription'
  | 'primaryAction'
  | 'primaryActionButtonType'
  | 'secondaryAction'
  | 'showBackIcon'
  | 'textSpacing'
  | 'title'
  | 'variant'
  | 'visible'
  | 'testID'
> {}

export const ModalSuccess: React.FC<ModalSuccessProps> = ({
  close,
  customClose,
  description,
  formattedDescription,
  primaryAction,
  secondaryAction,
  showBackIcon,
  textSpacing,
  title,
  variant,
  visible,
  testID = 'modal-success',
}) => {
  const insets = useSafeAreaInsets()
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  if (!visible) {
    return null
  }

  return (
    <>
      <StatusBar style="dark" />
      <AnimatedView
        className="bg-base-white absolute top-0 right-0 bottom-0 left-0"
        entering={reduceMotion ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid ? undefined : FadeOut}
      >
        {(customClose || close) && (
          <Pressable
            className={cn(
              'absolute z-[1] items-center justify-center rounded-md p-2',
              Platform.OS === 'android' ? 'top-10' : 'top-[52px]',
              'left-2',
            )}
            testID={`${testID}-close`}
            onPress={customClose || close}
          >
            <Icon color="#475467" name={showBackIcon ? 'arrow-left' : 'x-close'} size={24} />
          </Pressable>
        )}
        <View className="w-full flex-1 flex-col items-center justify-between">
          <View className="relative w-full flex-1 items-center justify-center px-4 pt-8">
            <AnimatedLottieView
              autoPlay
              loop={false}
              resizeMode="contain"
              source={successAnimation}
              speed={1}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
              }}
            />
            <View className="relative z-10 w-full items-center justify-center">
              <ModalContent
                description={description}
                formattedDescription={formattedDescription}
                textSpacing={textSpacing}
                title={title}
              />
            </View>
          </View>

          <ModalActions
            fullScreen={true}
            insets={insets}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            variant={variant}
          />
        </View>
      </AnimatedView>
    </>
  )
}
