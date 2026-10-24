import { type ComponentRef, type FC, useEffect, useRef, useState } from 'react'
import { Modal, Pressable, View, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'
import { MIN_TOUCH_TARGET_SIZE, TOUCH_HIT_SLOP } from '@farma/registry/lib/tokens'

import type { DotsDropdownOption, DotsDropdownProps } from './DotsDropdown.types'
import computeDropdownPosition from './utils/computeDropdownPosition'

/** Botón "…" que abre un menú contextual animado posicionado junto al disparador. */
export const DotsDropdown: FC<DotsDropdownProps> = ({
  options,
  position = 'center',
  bottomBoundaryOffset = 0,
  pressDots,
  style,
  iconColor,
  className,
  accessibilityLabel = 'Más opciones',
  accessibilityHint,
  testID = 'dots-dropdown',
  isOpen,
}) => {
  const isControlled = isOpen !== undefined
  const buttonRef = useRef<ComponentRef<typeof Pressable>>(null)
  const [internalOpen, setInternalOpen] = useState(false)
  const [stylesOptions, setStylesOptions] = useState<ViewStyle>({})
  const showOptions = isControlled ? isOpen : internalOpen
  const [shouldRenderModal, setShouldRenderModal] = useState(showOptions)

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)
  const translateY = useSharedValue(-10)

  const setShowOptions = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
  }

  useEffect(() => {
    if (showOptions) {
      setShouldRenderModal(true)
      opacity.value = withTiming(1, { duration: 200 })
      scale.value = withTiming(1, { duration: 200 })
      translateY.value = withTiming(0, { duration: 200 })

      return
    }

    opacity.value = withTiming(0, { duration: 150 })
    scale.value = withTiming(0.8, { duration: 150 })
    translateY.value = withTiming(-10, { duration: 150 })

    const timer = setTimeout(() => {
      setShouldRenderModal(false)
    }, 150)

    return () => clearTimeout(timer)
  }, [showOptions, opacity, scale, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }))

  const openDropdown = (pageX: number, pageY: number, width: number, height: number) => {
    setStylesOptions(
      computeDropdownPosition({
        pageX,
        pageY,
        width,
        height,
        optionsCount: options.length,
        bottomBoundaryOffset,
      }),
    )
    setShowOptions(true)
  }

  const handlePress = () => {
    const node = buttonRef.current

    if (!node?.measure) {
      openDropdown(0, 0, MIN_TOUCH_TARGET_SIZE, MIN_TOUCH_TARGET_SIZE)

      return
    }

    node.measure((_x, _y, width, height, pageX, pageY) => {
      openDropdown(pageX, pageY, width, height)
    })
  }

  const handleOutsidePress = () => {
    setShowOptions(false)
  }

  const handleDotsPress = () => {
    handlePress()
    pressDots?.()
  }

  const handleOptionPress = (option: DotsDropdownOption) => () => {
    option.onPress()
    setShowOptions(false)
  }

  return (
    <>
      <Pressable
        ref={buttonRef}
        accessibilityHint={accessibilityHint}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ expanded: showOptions }}
        className={className}
        hitSlop={TOUCH_HIT_SLOP}
        style={[{ minHeight: MIN_TOUCH_TARGET_SIZE, minWidth: MIN_TOUCH_TARGET_SIZE }, style]}
        testID={testID}
        onPress={handleDotsPress}
      >
        <Icon color={iconColor || '#1D2939'} name="dots-horizontal" size={20} />
      </Pressable>
      {shouldRenderModal && (
        <Modal
          transparent
          accessibilityViewIsModal
          animationType="none"
          testID={`${testID}-modal`}
          visible={showOptions}
          onRequestClose={handleOutsidePress}
        >
          <View className="flex-1" testID={`${testID}-overlay`}>
            <Pressable
              accessibilityElementsHidden
              accessible={false}
              className="absolute inset-0"
              importantForAccessibility="no-hide-descendants"
              testID={`${testID}-backdrop`}
              onPress={handleOutsidePress}
            />
            <Animated.View style={[animatedStyle, { position: 'absolute', ...stylesOptions }]}>
              <View
                accessibilityRole="menu"
                className={cn(
                  'bg-base-white gap-4 rounded-sm p-2',
                  position === 'left' && 'self-start',
                  position === 'right' && 'self-end',
                  position === 'center' && 'self-center',
                )}
                style={{
                  shadowColor: 'rgba(16, 24, 40, 1)',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.26,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                {options.map((option, idx) => (
                  <Pressable
                    key={`${idx}-${option.label}`}
                    accessibilityHint={option.accessibilityHint}
                    accessibilityLabel={option.accessibilityLabel ?? option.label}
                    accessibilityRole="menuitem"
                    className="flex-row items-center gap-3 p-2"
                    style={{ opacity: 1, minHeight: MIN_TOUCH_TARGET_SIZE }}
                    testID={option.testID ?? `${testID}-option-${idx}`}
                    onPress={handleOptionPress(option)}
                  >
                    {option.icon ? (
                      <View accessible={false} importantForAccessibility="no-hide-descendants">
                        <Icon name={option.icon} size={24} />
                      </View>
                    ) : null}
                    <Text accessible={false}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </>
  )
}

export default DotsDropdown
