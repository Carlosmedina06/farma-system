import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, Pressable, ScrollView, View } from 'react-native'
import { Gesture, GestureDetector, type GestureType } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'
import { useBackHandler } from '@react-native-community/hooks'

import { shadowBottom, TOUCH_HIT_SLOP } from '@farma/registry/lib/tokens'
import { Icon } from '@farma/registry/ui/icon'
import { Portal } from '@farma/registry/ui/portal'
import { Text } from '@farma/registry/ui/text'

import { BottomSheetProps } from './BottomSheet.types'

const maxHeight = Dimensions.get('window').height * 0.85
const animationDuration = 300
const dismissVelocityThreshold = 600

const getSheetHeight = (full?: boolean, heightPercent?: number) => {
  if (full) return maxHeight
  if (heightPercent != null && heightPercent > 0 && heightPercent <= 1) {
    return Dimensions.get('window').height * heightPercent
  }

  return undefined
}

type BottomSheetHeaderProps = Readonly<{
  panGesture: GestureType
  showPill: boolean
  showCloseIcon: boolean
  hideTitle: boolean
  title?: string
  closeIconTestID?: string
  closeAccessibilityLabel?: string
  closeAccessibilityHint?: string
  onCloseIconPress: () => void
}>

function BottomSheetHeader({
  panGesture,
  showPill,
  showCloseIcon,
  hideTitle,
  title,
  closeIconTestID,
  closeAccessibilityLabel = 'Cerrar',
  closeAccessibilityHint,
  onCloseIconPress,
}: BottomSheetHeaderProps) {
  return (
    <>
      {showPill && (
        <GestureDetector gesture={panGesture}>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="py-padding-lg items-center justify-center"
          >
            <View className="h-spacing-1 w-spacing-7 rounded-sm bg-gray-300" />
          </View>
        </GestureDetector>
      )}

      {showCloseIcon && hideTitle && (
        <View className="px-padding-xl py-padding-lg self-end">
          <Pressable
            accessibilityHint={closeAccessibilityHint}
            accessibilityLabel={closeAccessibilityLabel}
            accessibilityRole="button"
            className="p-padding-sm rounded-md"
            hitSlop={TOUCH_HIT_SLOP}
            testID={closeIconTestID}
            onPress={onCloseIconPress}
          >
            <Icon color="#1d2939" name="x-close" size={24} />
          </Pressable>
        </View>
      )}

      {!hideTitle && (
        <View className="gap-gap-xs px-padding-xl py-padding-lg flex-row items-center border-b border-gray-300">
          <Text
            accessibilityLiveRegion="polite"
            accessibilityRole="header"
            className="min-w-0 flex-1 shrink text-gray-800"
            maxFontSizeMultiplier={1.5}
            type="h1"
          >
            {title}
          </Text>
          {showCloseIcon && (
            <Pressable
              accessibilityHint={closeAccessibilityHint}
              accessibilityLabel={closeAccessibilityLabel}
              accessibilityRole="button"
              className="p-padding-sm shrink-0 rounded-md"
              hitSlop={TOUCH_HIT_SLOP}
              testID={closeIconTestID}
              onPress={onCloseIconPress}
            >
              <Icon className="text-gray-600" name="x-close" size={24} />
            </Pressable>
          )}
        </View>
      )}
    </>
  )
}

export const BottomSheet = ({
  open,
  title,
  close,
  onCloseIconPress,
  children,
  content,
  full,
  heightPercent,
  divider = false,
  hideTitle = !title,
  closeControl = 'both',
  closeIconTestID,
  closeAccessibilityLabel,
  closeAccessibilityHint,
  testID,
}: BottomSheetProps) => {
  const insets = useSafeAreaInsets()
  const bottomInset = Math.max(insets.bottom, 16)
  const showPill = closeControl === 'pill' || closeControl === 'both'
  const showCloseIcon = closeControl === 'x' || closeControl === 'both'

  const [height, setHeight] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const fixedHeight = getSheetHeight(full, heightPercent)
  const Content = content || (fixedHeight == null && height > maxHeight ? ScrollView : Fragment)

  const animatedFixedHeight = useSharedValue(fixedHeight ?? 0)

  const backdropOpacity = useSharedValue(0)
  const sheetTranslateY = useSharedValue(fixedHeight ?? maxHeight)
  const dragStartTranslateY = useSharedValue(0)

  const sheetMax = fixedHeight ?? maxHeight

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY(8)
        .failOffsetX([-48, 48])
        .onStart(() => {
          cancelAnimation(sheetTranslateY)
          cancelAnimation(backdropOpacity)
          dragStartTranslateY.value = sheetTranslateY.value
        })
        .onUpdate((e) => {
          const next = Math.min(sheetMax, Math.max(0, dragStartTranslateY.value + e.translationY))

          sheetTranslateY.value = next
          backdropOpacity.value = 1 - next / sheetMax
        })
        .onEnd((e) => {
          const y = sheetTranslateY.value

          const shouldClose = y > sheetMax * 0.22 || e.velocityY > dismissVelocityThreshold

          if (shouldClose) {
            sheetTranslateY.value = withTiming(
              sheetMax,
              { duration: animationDuration },
              (finished) => {
                if (finished) {
                  scheduleOnRN(close)
                }
              },
            )
            backdropOpacity.value = withTiming(0, {
              duration: animationDuration,
            })
          } else {
            sheetTranslateY.value = withTiming(0, {
              duration: animationDuration,
            })
            backdropOpacity.value = withTiming(1, {
              duration: animationDuration,
            })
          }
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sheetTranslateY, backdropOpacity, dragStartTranslateY are stable refs
    [close, sheetMax],
  )

  const handleBackdropPress = useCallback(() => {
    cancelAnimation(sheetTranslateY)
    cancelAnimation(backdropOpacity)
    sheetTranslateY.value = withTiming(sheetMax, { duration: animationDuration }, (finished) => {
      if (finished) {
        scheduleOnRN(close)
      }
    })
    backdropOpacity.value = withTiming(0, { duration: animationDuration })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sheetTranslateY, backdropOpacity are stable refs
  }, [close, sheetMax])

  const handleCloseIconPress = onCloseIconPress ?? handleBackdropPress

  useEffect(() => {
    if (fixedHeight == null) {
      return
    }
    if (!open) {
      animatedFixedHeight.value = fixedHeight

      return
    }
    animatedFixedHeight.value = withTiming(fixedHeight, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    })
  }, [fixedHeight, open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) {
      setIsVisible(true)
      backdropOpacity.value = withTiming(1, { duration: animationDuration })
      sheetTranslateY.value = withTiming(0, { duration: animationDuration })
    } else {
      backdropOpacity.value = withTiming(0, { duration: animationDuration })
      sheetTranslateY.value = withTiming(sheetMax, {
        duration: animationDuration,
      })
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, animationDuration)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useBackHandler(() => {
    if (open) {
      close()

      return true
    }

    return false
  })

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }))

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }))

  const hasFixedHeight = fixedHeight != null

  const animatedFixedHeightStyle = useAnimatedStyle(() => {
    if (!hasFixedHeight) {
      return {}
    }

    return {
      height: animatedFixedHeight.value,
      minHeight: animatedFixedHeight.value,
      maxHeight: animatedFixedHeight.value,
    }
  }, [hasFixedHeight])

  if (!isVisible && !open) {
    return null
  }

  return (
    <Portal>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 0,
          },
          backdropStyle,
        ]}
      >
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ flex: 1 }}
          testID={testID ? `${testID}-backdrop` : 'bottom-sheet-backdrop'}
          onPress={handleBackdropPress}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFF',
            paddingTop: showPill ? 0 : 24,
            paddingBottom: bottomInset,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
            zIndex: 2,
            minHeight: 220,
            maxHeight: maxHeight,
            flexDirection: 'column',
          },
          full && !hasFixedHeight && { minHeight: maxHeight },
          sheetStyle,
          animatedFixedHeightStyle,
        ]}
        onLayout={fixedHeight == null ? (e) => setHeight(e.nativeEvent.layout.height) : undefined}
      >
        <BottomSheetHeader
          closeAccessibilityHint={closeAccessibilityHint}
          closeAccessibilityLabel={closeAccessibilityLabel}
          closeIconTestID={closeIconTestID}
          hideTitle={hideTitle}
          onCloseIconPress={handleCloseIconPress}
          panGesture={panGesture}
          showCloseIcon={showCloseIcon}
          showPill={showPill}
          title={title}
        />

        {divider && hideTitle && (
          <View style={{ ...shadowBottom }} className="h-px w-full bg-gray-200" />
        )}

        {Content === ScrollView ? (
          <ScrollView className="pb-8">{children}</ScrollView>
        ) : (
          <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
        )}
      </Animated.View>
    </Portal>
  )
}
