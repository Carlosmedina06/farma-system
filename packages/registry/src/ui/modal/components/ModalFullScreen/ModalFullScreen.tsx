import React from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Animated, { useReducedMotion, FadeIn, FadeOut } from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Portal } from '@farma/registry/ui/portal'
import { cn } from '@farma/registry/lib/utils'

import { ModalContent } from '../ModalContent/ModalContent'
import { ModalActions } from '../ModalActions/ModalActions'
import { ModalProps } from '../../Modal.types'

const AnimatedView = Animated.createAnimatedComponent(View)

interface ModalFullScreenProps extends Pick<
  ModalProps,
  | 'close'
  | 'customClose'
  | 'description'
  | 'formattedDescription'
  | 'icon'
  | 'instant'
  | 'preContent'
  | 'primaryAction'
  | 'secondaryAction'
  | 'showBackIcon'
  | 'textSpacing'
  | 'title'
  | 'variant'
  | 'visible'
  | 'hideCloseButton'
  | 'testID'
> {}

export const ModalFullScreen: React.FC<ModalFullScreenProps> = ({
  hideCloseButton,
  preContent,
  icon,
  instant,
  title,
  description,
  formattedDescription,
  textSpacing,
  primaryAction,
  secondaryAction,
  variant,
  close,
  customClose,
  showBackIcon,
  visible,
  testID = 'modal-fullscreen',
}) => {
  const insets = useSafeAreaInsets()
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  if (!visible) {
    return null
  }

  return (
    <Portal>
      <StatusBar style="dark" />
      <AnimatedView
        className="bg-base-white absolute top-0 right-0 bottom-0 left-0"
        entering={reduceMotion || instant ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid || instant ? undefined : FadeOut}
      >
        {!hideCloseButton && (customClose || close) ? (
          <Pressable
            className={cn(
              'absolute z-[1] items-center justify-center rounded-md p-2',
              Platform.OS === 'android' ? 'top-14' : 'top-[80px]',
              'left-2',
            )}
            testID={`${testID}-close`}
            onPress={customClose || close}
          >
            <Icon color="#475467" name={showBackIcon ? 'arrow-left' : 'x-close'} size={24} />
          </Pressable>
        ) : null}
        <View className="w-full flex-1 flex-col items-center justify-between">
          <View className="relative w-full flex-1 items-center justify-center px-4 pt-8">
            <ModalContent
              description={description}
              formattedDescription={formattedDescription}
              icon={icon}
              preContent={preContent}
              textSpacing={textSpacing}
              title={title}
            />
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
    </Portal>
  )
}
