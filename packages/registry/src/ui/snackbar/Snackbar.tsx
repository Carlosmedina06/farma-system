import { useEffect, useRef } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@farma/registry/ui/icon'
import { Portal } from '@farma/registry/ui/portal'
import { Text } from '@farma/registry/ui/text'

export type SnackbarVariant = 'neutral' | 'success' | 'error'

export type SnackbarProps = {
  text: string
  variant?: SnackbarVariant
  open: boolean
  entrance?: 'slide' | 'fade'
  actionText?: string
  onPressAction?: () => void
  onExitComplete?: () => void
  onDismiss?: () => void
  dismissLabel?: string
  testID?: string
}

const ENTRANCE_MS = 200
const EXIT_MS = 200

const VARIANTS: Record<SnackbarVariant, { container: string; iconName: 'alert-circle' | 'check-circle' }> = {
  neutral: { container: 'bg-gray-800', iconName: 'alert-circle' },
  success: { container: 'bg-success-600', iconName: 'check-circle' },
  error: { container: 'bg-error-600', iconName: 'alert-circle' },
}

export function Snackbar({
  text,
  variant = 'neutral',
  open,
  entrance = 'slide',
  actionText,
  onPressAction,
  onExitComplete,
  onDismiss,
  dismissLabel = 'Cerrar',
  testID,
}: SnackbarProps) {
  const dismissible = onDismiss != null
  const reduceMotion = useReducedMotion()
  const insets = useSafeAreaInsets()
  const fade = entrance === 'fade'
  const opacity = useSharedValue(open && fade ? 1 : 0)
  const translateY = useSharedValue(0)
  const barHeight = useSharedValue(0)
  const onExitCompleteRef = useRef(onExitComplete)

  onExitCompleteRef.current = onExitComplete

  useEffect(() => {
    const fireExit = () => onExitCompleteRef.current?.()
    const hidden = -Math.max(barHeight.value, insets.top + 48)

    if (open) {
      if (reduceMotion || fade) {
        translateY.value = 0
        opacity.value = 1
        return
      }

      opacity.value = withTiming(1, { duration: ENTRANCE_MS, easing: Easing.out(Easing.ease) })
      translateY.value = withTiming(0, { duration: ENTRANCE_MS, easing: Easing.out(Easing.ease) })
      return
    }

    if (reduceMotion) {
      opacity.value = 0
      translateY.value = hidden
      if (onExitCompleteRef.current != null) fireExit()
      return
    }

    opacity.value = withTiming(0, { duration: EXIT_MS, easing: Easing.inOut(Easing.ease) }, (finished) => {
      if (finished && onExitCompleteRef.current != null) scheduleOnRN(fireExit)
    })
    translateY.value = withTiming(hidden, { duration: EXIT_MS, easing: Easing.in(Easing.ease) })
  }, [barHeight, fade, insets.top, opacity, open, reduceMotion, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const styles = VARIANTS[variant]
  const hasActions = Boolean(actionText) || dismissible

  return (
    <Portal>
      <Animated.View
        className={`absolute top-0 right-0 left-0 z-50 w-full ${styles.container}`}
        pointerEvents={open && (actionText || dismissible) ? 'box-none' : 'none'}
        style={[{ paddingTop: insets.top }, animatedStyle]}
        testID={testID}
        onLayout={(event) => {
          const next = event.nativeEvent.layout.height
          barHeight.value = next
          if (!open) translateY.value = -next
        }}
      >
      <View className="py-spacing-2 w-full">
        <View
          className="gap-gap-xs px-spacing-7 w-full flex-row items-center justify-center"
          testID={testID ? `${testID}-label` : 'snackbar-label'}
        >
          <Icon className="text-base-white shrink-0" name={styles.iconName} size={20} />
          <Text className="text-base-white shrink text-center" maxFontSizeMultiplier={1.2} numberOfLines={2} type="body2">
            {text}
          </Text>
        </View>
        {hasActions && (
          <View className="absolute top-0 right-0 bottom-0 flex-row items-center gap-gap-xs pr-spacing-2">
            {actionText && onPressAction && (
              <TouchableOpacity
                accessibilityRole="button"
                hitSlop={8}
                testID={testID ? `${testID}-action` : 'snackbar-action'}
                onPress={onPressAction}
              >
                <Text className="text-base-white" maxFontSizeMultiplier={1.2} semibold type="body2">
                  {actionText}
                </Text>
              </TouchableOpacity>
            )}
            {dismissible && (
              <TouchableOpacity
                accessibilityLabel={dismissLabel}
                accessibilityRole="button"
                hitSlop={8}
                testID={testID ? `${testID}-dismiss` : 'snackbar-dismiss'}
                onPress={onDismiss}
              >
                <Icon className="text-base-white" name="x-close" size={24} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Animated.View>
    </Portal>
  )
}
