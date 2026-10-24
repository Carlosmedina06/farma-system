import React from 'react'
import { Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { UniwindSafeAreaView } from '@farma/registry/ui/safe-area-view'
import { StatusBar } from 'expo-status-bar'
import Animated, { useReducedMotion, FadeIn, FadeOut } from 'react-native-reanimated'
import { ButtonSectionLayout } from '@farma/registry/ui/button-section-layout'
import { Portal } from '@farma/registry/ui/portal'

import FeedbackModal from './components/ModalFeedBack/ModalFeedBack'
import CompactModal from './components/CompactModal/CompactModal'
import { ModalFullScreen } from './components/ModalFullScreen/ModalFullScreen'
import { ModalNormal } from './components/ModalNormal/ModalNormal'
import { ModalSuccessAnimated } from './ModalSuccessAnimated'
import { ModalProps } from './Modal.types'

const AnimatedView = Animated.createAnimatedComponent(View)

type ModalContentProps = ModalProps & {
  insets: ReturnType<typeof useSafeAreaInsets>
  reduceMotion: boolean | null
  isAndroid: boolean
}

const renderModalContent = (props: ModalContentProps): React.ReactNode => {
  const {
    isCompactModal,
    isSuccess,
    fullScreen,
    feedback,
    primaryAction,
    secondaryAction,
    preContent,
    icon,
    title,
    description,
    secondaryDescription,
    formattedDescription,
    visible,
    close,
    customClose,
    circumferenceColor,
    textSpacing,
    variant,
    isLoading,
    showBackIcon,
    hideCloseButton,
    instant,
    insets,
    reduceMotion,
    isAndroid,
    testID,
  } = props

  if (isCompactModal) {
    return (
      <CompactModal
        formattedDescription={formattedDescription}
        icon={icon!}
        isLoading={isLoading}
        isVisible={visible!}
        primaryAction={primaryAction!}
        primaryDescription={description!}
        secondaryAction={secondaryAction!}
        secondaryDescription={secondaryDescription!}
        title={title!}
        close={close}
        customClose={customClose}
      />
    )
  }

  if (visible && feedback && !isSuccess && !isCompactModal) {
    return (
      <Portal>
        {fullScreen && <StatusBar style="dark" />}
        <AnimatedView
          className="bg-base-white absolute top-0 right-0 bottom-0 left-0"
          entering={reduceMotion || isAndroid ? undefined : FadeIn}
          exiting={reduceMotion || isAndroid ? undefined : FadeOut}
          style={{
            width: '100%',
            height: '100%',
            zIndex: 9999,
            elevation: 9999,
          }}
        >
          <View className="h-full w-full">
            <FeedbackModal
              circumferenceColor={circumferenceColor}
              description={description}
              formattedDescription={formattedDescription}
              preContent={preContent}
              title={title}
            />
            {primaryAction || secondaryAction ? (
              <UniwindSafeAreaView edges={isAndroid ? ['bottom'] : []}>
                <View className="bg-base-white w-full flex-col px-4 pt-3 pb-9">
                  <ButtonSectionLayout
                    primaryButton={primaryAction}
                    secondaryButton={secondaryAction}
                    variant={variant}
                  />
                </View>
              </UniwindSafeAreaView>
            ) : null}
          </View>
        </AnimatedView>
      </Portal>
    )
  }

  if (isSuccess) {
    return (
      <>
        {visible && (
          <ModalSuccessAnimated
            description={description}
            formattedDescription={formattedDescription}
            insets={insets}
            primaryAction={primaryAction}
            secondaryAction={secondaryAction}
            title={title}
            variant={variant}
          />
        )}
      </>
    )
  }

  if (fullScreen) {
    return (
      <ModalFullScreen
        close={close}
        customClose={customClose}
        description={description}
        formattedDescription={formattedDescription}
        hideCloseButton={hideCloseButton}
        icon={icon}
        instant={instant}
        preContent={preContent}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        showBackIcon={showBackIcon}
        textSpacing={textSpacing}
        title={title}
        variant={variant}
        visible={visible}
      />
    )
  }

  return (
    <ModalNormal
      close={close}
      customClose={customClose}
      description={description}
      formattedDescription={formattedDescription}
      hideCloseButton={hideCloseButton}
      icon={icon}
      preContent={preContent}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      textSpacing={textSpacing}
      title={title}
      variant={variant}
      visible={visible}
      testID={testID}
    />
  )
}

export const Modal: React.FC<ModalProps> = (props) => {
  const insets = useSafeAreaInsets()
  const reduceMotion = useReducedMotion()
  const isAndroid = Platform.OS === 'android'

  return <>{renderModalContent({ ...props, insets, reduceMotion, isAndroid })}</>
}
