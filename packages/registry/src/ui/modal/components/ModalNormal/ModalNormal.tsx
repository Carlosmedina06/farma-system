import React from 'react'
import { Platform, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, { useReducedMotion, FadeIn, FadeOut } from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Portal } from '@farma/registry/ui/portal'
import { cn } from '@farma/registry/lib/utils'
import { MIN_TOUCH_TARGET_SIZE } from '@farma/registry/lib/tokens'

import { ModalContent } from '../ModalContent/ModalContent'
import { ModalActions } from '../ModalActions/ModalActions'
import { ModalProps } from '../../Modal.types'

const AnimatedView = Animated.createAnimatedComponent(View)

interface ModalNormalProps extends Pick<
  ModalProps,
  | 'close'
  | 'customClose'
  | 'description'
  | 'formattedDescription'
  | 'hideCloseButton'
  | 'icon'
  | 'preContent'
  | 'primaryAction'
  | 'secondaryAction'
  | 'textSpacing'
  | 'title'
  | 'variant'
  | 'visible'
  | 'testID'
> {}

export const ModalNormal: React.FC<ModalNormalProps> = ({
  preContent,
  icon,
  title,
  description,
  formattedDescription,
  textSpacing,
  primaryAction,
  secondaryAction,
  variant,
  close,
  customClose,
  hideCloseButton,
  visible,
  testID = 'modal-normal',
}) => {
  const insets = useSafeAreaInsets()
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'
  const showCloseButton = !hideCloseButton && Boolean(customClose || close)

  if (!visible) {
    return null
  }

  return (
    <Portal>
      <AnimatedView
        accessibilityElementsHidden
        className="bg-overlay-gray80060 absolute top-0 right-0 bottom-0 left-0"
        entering={reduceMotion ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid ? undefined : FadeOut}
        importantForAccessibility="no-hide-descendants"
        testID={`${testID}-backdrop`}
      />
      <AnimatedView
        accessibilityLabel={title}
        accessibilityViewIsModal
        className="absolute top-0 right-0 bottom-0 left-0 items-center justify-center p-4"
        entering={reduceMotion ? undefined : FadeIn}
        exiting={reduceMotion || isAndroid ? undefined : FadeOut}
        testID={testID}
      >
        <View
          className="bg-base-white relative flex-col items-center overflow-hidden rounded-md shadow-lg"
          style={{
            width: '100%',
            alignSelf: 'center',
            shadowColor: '#101828',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          <View
            className={cn(
              'relative w-full items-center justify-center p-6 px-4',
              variant === 'verticalSingleButton' && 'pb-0',
              variant !== 'verticalSingleButton' && 'pb-0',
            )}
          >
            {showCloseButton && (
              <Pressable
                accessibilityHint="Cierra el diálogo"
                accessibilityLabel="Cerrar"
                accessibilityRole="button"
                className="absolute top-4 right-4 z-10 items-center justify-center rounded-xl p-3"
                style={{ minHeight: MIN_TOUCH_TARGET_SIZE, minWidth: MIN_TOUCH_TARGET_SIZE }}
                testID={`${testID}-close`}
                onPress={customClose || close}
              >
                <View accessible={false} importantForAccessibility="no-hide-descendants">
                  <Icon className="text-gray-800" name="x-close" size={24} />
                </View>
              </Pressable>
            )}
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
            fullScreen={false}
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
