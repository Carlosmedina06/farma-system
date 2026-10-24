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
import { Text } from '@farma/registry/ui/text'

export type InlineSnackbarVariant = 'neutral' | 'success' | 'error'

export type InlineSnackbarProps = {
  text: string
  variant: InlineSnackbarVariant
  /** Controla la visibilidad; anima la entrada y la salida. */
  open: boolean
  /** `fade` aparece sin desplazarse; `slide` baja desde arriba. Default `slide`. */
  entrance?: 'slide' | 'fade'
  /** Centra el texto (solo si no hay acción). Default `false`. */
  centered?: boolean
  actionText?: string
  onPressAction?: () => void
  onExitComplete?: () => void
  /** Si se pasa, muestra la X para cerrar. */
  onDismiss?: () => void
  dismissLabel?: string
  testID?: string
}

const SNACKBAR_ENTRANCE_MS = 200
const SNACKBAR_EXIT_MS = 200
const OFFLINE_DISSOLVE_ENTRANCE_MS = 250

const VARIANT_STYLES: Record<
  InlineSnackbarVariant,
  { container: string; iconName: 'alert-circle' | 'check-circle' }
> = {
  neutral: {
    container: 'bg-gray-800',
    iconName: 'alert-circle',
  },
  success: {
    container: 'bg-success-600',
    iconName: 'check-circle',
  },
  error: {
    container: 'bg-error-600',
    iconName: 'alert-circle',
  },
}

/** Banner controlado (no usa estado global): ideal para conectividad, avisos persistentes, etc. */
export function InlineSnackbar(props: Readonly<InlineSnackbarProps>) {
  const {
    text,
    variant,
    open,
    entrance = 'slide',
    centered = false,
    actionText,
    onPressAction,
    onExitComplete,
    onDismiss,
    dismissLabel = 'Cerrar',
    testID,
  } = props
  const isDismissible = onDismiss != null
  const reduceMotion = useReducedMotion()
  const insets = useSafeAreaInsets()
  const isDissolveEntrance = entrance === 'fade'
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(isDissolveEntrance ? 0 : -32)

  const onExitCompleteRef = useRef(onExitComplete)

  onExitCompleteRef.current = onExitComplete

  useEffect(() => {
    const fireExit = () => {
      onExitCompleteRef.current?.()
    }

    if (open) {
      if (reduceMotion) {
        translateY.value = 0
        opacity.value = 1

        return
      }

      if (isDissolveEntrance) {
        translateY.value = 0
        opacity.value = withTiming(1, {
          duration: OFFLINE_DISSOLVE_ENTRANCE_MS,
          easing: Easing.inOut(Easing.ease),
        })
      } else {
        opacity.value = withTiming(1, {
          duration: SNACKBAR_ENTRANCE_MS,
          easing: Easing.out(Easing.ease),
        })
        translateY.value = withTiming(0, {
          duration: SNACKBAR_ENTRANCE_MS,
          easing: Easing.out(Easing.ease),
        })
      }

      return
    }

    if (reduceMotion) {
      opacity.value = 0
      translateY.value = -16

      if (onExitCompleteRef.current != null) {
        fireExit()
      }

      return
    }

    opacity.value = withTiming(
      0,
      { duration: SNACKBAR_EXIT_MS, easing: Easing.inOut(Easing.ease) },
      (finished) => {
        if (finished && onExitCompleteRef.current != null) scheduleOnRN(fireExit)
      },
    )
    translateY.value = withTiming(-16, {
      duration: SNACKBAR_EXIT_MS,
      easing: Easing.in(Easing.ease),
    })
  }, [open, isDissolveEntrance, opacity, reduceMotion, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const styles = VARIANT_STYLES[variant]
  const centerLabel = centered && !actionText
  const label = (
    <>
      <Icon className="text-base-white shrink-0" name={styles.iconName} size={20} />
      <Text
        className="text-base-white shrink text-center"
        maxFontSizeMultiplier={1.2}
        numberOfLines={2}
        semibold={isDismissible}
        type="body2"
      >
        {text}
      </Text>
    </>
  )
  const actions = (actionText || isDismissible) && (
    <>
      {actionText && onPressAction && (
        <TouchableOpacity
          accessibilityRole="button"
          hitSlop={8}
          testID={testID ? `${testID}-action` : undefined}
          onPress={onPressAction}
        >
          <Text className="text-base-white" maxFontSizeMultiplier={1.2} semibold type="body2">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
      {isDismissible && (
        <TouchableOpacity
          accessibilityLabel={dismissLabel}
          accessibilityRole="button"
          hitSlop={8}
          testID={testID ? `${testID}-dismiss` : undefined}
          onPress={onDismiss}
        >
          <Icon className="text-base-white" name="x-close" size={24} />
        </TouchableOpacity>
      )}
    </>
  )

  return (
    <Animated.View
      className={`w-full ${styles.container}`}
      pointerEvents={isDismissible ? 'box-none' : 'none'}
      style={[{ paddingTop: insets.top }, animatedStyle]}
      testID={testID}
    >
      {centerLabel ? (
        <View className="py-spacing-2 w-full">
          <View
            className="gap-gap-xs px-spacing-7 w-full flex-row items-center justify-center"
            testID={testID ? `${testID}-label` : undefined}
          >
            {label}
          </View>
          {isDismissible && (
            <View className="absolute top-0 right-0 bottom-0 flex-row items-center pr-spacing-2">
              {actions}
            </View>
          )}
        </View>
      ) : (
        <View className="gap-gap-xs py-spacing-2 pl-spacing-4 pr-spacing-2 w-full flex-row items-center">
          <View
            className="gap-gap-xs min-w-0 flex-1 flex-row items-center justify-start"
            testID={testID ? `${testID}-label` : undefined}
          >
            {label}
          </View>
          {actions && <View className="gap-gap-xs shrink-0 flex-row items-center">{actions}</View>}
        </View>
      )}
    </Animated.View>
  )
}
