import type { FeedbackScreenViewProps } from './types/FeedbackScreen.types'

import { Dimensions, View } from 'react-native'
import Animated from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { Text } from '@farma/registry/ui/text'
import { Portal } from '@farma/registry/ui/portal'
import { UniwindSafeAreaView } from '@farma/registry/ui/safe-area-view'
import { FULL_SCREEN_EDGES } from '@farma/registry/ui/screen-layout'

import useFeedbackScreen from './hooks/useFeedbackScreen'
import FeedbackActionButton from './components/FeedbackActionButton'

const { width, height } = Dimensions.get('window')
const CIRCLE_SIZE = Math.max(width, height) * 2.2

const circleLayoutStyle = {
  position: 'absolute' as const,
  width: CIRCLE_SIZE,
  height: CIRCLE_SIZE,
  borderRadius: CIRCLE_SIZE / 2,
  top: height / 2 - CIRCLE_SIZE / 2,
  left: width / 2 - CIRCLE_SIZE / 2,
}

export default function FeedbackScreenView({
  feedbackId,
  type,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  animationSource,
  loop,
  autoAction,
  testID = 'feedback-screen',
  onAutoActionPress,
  onPrimaryPress,
  onSecondaryPress,
}: Readonly<FeedbackScreenViewProps>) {
  const {
    lottieRef,
    lottieSource,
    lottieLoop,
    rootStyle,
    circleStyle,
    contentStyle,
    buttonsStyle,
    handlePrimaryPress,
    handleSecondaryPress,
    handleLottieAnimationFinish,
  } = useFeedbackScreen({
    feedbackId,
    type,
    animationSource,
    loop,
    primaryAction,
    secondaryAction,
    autoAction,
    onAutoActionPress,
    onPrimaryPress,
    onSecondaryPress,
  })

  const lottieStyle = { width: lottieSource.w, height: lottieSource.h }

  return (
    <Portal>
    <Animated.View
      accessibilityViewIsModal
      className="absolute inset-0 z-9999 flex-1 overflow-hidden"
      style={rootStyle}
    >
      <Animated.View
        renderToHardwareTextureAndroid
        shouldRasterizeIOS
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[circleLayoutStyle, circleStyle]}
      />
      <UniwindSafeAreaView className="flex-1" edges={FULL_SCREEN_EDGES} testID={testID}>
        <Animated.View className="px-padding-xl py-padding-xl flex-1 justify-between">
          <Animated.View
            className="gap-gap-md flex-1 items-center justify-center"
            style={contentStyle}
          >
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={lottieStyle}
            >
              <LottieView
                key={`${feedbackId}-${type}`}
                ref={lottieRef}
                autoPlay={false}
                loop={lottieLoop}
                source={lottieSource}
                style={lottieStyle}
                webStyle={lottieStyle}
                onAnimationFinish={handleLottieAnimationFinish}
              />
            </View>
            <View
              accessibilityLiveRegion="assertive"
              accessibilityRole="alert"
              className="gap-gap-xs items-center"
            >
              <Text className="text-base-white text-center" type="h2">
                {title}
              </Text>
              {!!subtitle && (
                <Text className="text-base-white text-center" type="body1">
                  {subtitle}
                </Text>
              )}
            </View>
          </Animated.View>
          <Animated.View className="gap-gap-xs" style={buttonsStyle}>
            <FeedbackActionButton
              action={primaryAction}
              variant="primary"
              onPress={handlePrimaryPress}
            />
            <FeedbackActionButton
              action={secondaryAction}
              variant="secondary"
              onPress={handleSecondaryPress}
            />
          </Animated.View>
        </Animated.View>
      </UniwindSafeAreaView>
    </Animated.View>
    </Portal>
  )
}
