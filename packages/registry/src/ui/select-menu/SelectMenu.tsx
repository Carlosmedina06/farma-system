import { useEffect, useRef, useState } from 'react'
import { Modal, Pressable, TouchableWithoutFeedback, View, type ViewInstance, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { shadowCard } from '@farma/registry/lib/tokens'
import { cn } from '@farma/registry/lib/utils'

import { openSelectMenuAtNode } from './selectMenuPosition'
import type { SelectMenuOption, SelectMenuProps } from './SelectMenu.types'

/** Select con popover anclado al trigger (abre arriba si no hay espacio abajo). */
export default function SelectMenu({
  options,
  value,
  placeholder = 'Seleccioná una opción',
  onChange,
  accessibilityLabel,
  accessibilityHint,
  className,
  testID = 'select-menu',
}: SelectMenuProps) {
  const triggerRef = useRef<ViewInstance>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [shouldRenderModal, setShouldRenderModal] = useState(false)
  const [menuStyle, setMenuStyle] = useState<ViewStyle>({})
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(-8)

  useEffect(() => {
    if (isOpen) {
      setShouldRenderModal(true)
      opacity.value = withTiming(1, { duration: 160 })
      translateY.value = withTiming(0, { duration: 160 })

      return
    }

    opacity.value = withTiming(0, { duration: 120 })
    translateY.value = withTiming(-8, { duration: 120 })
    const timer = setTimeout(() => setShouldRenderModal(false), 120)

    return () => clearTimeout(timer)
  }, [isOpen, opacity, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  const handleOpen = () => {
    openSelectMenuAtNode(triggerRef.current, options.length, (style) => {
      setMenuStyle(style)
      setIsOpen(true)
    })
  }

  const handleSelect = (option: SelectMenuOption) => {
    onChange?.(option)
    setIsOpen(false)
  }

  return (
    <>
      <View ref={triggerRef} className={cn('relative', className)} testID={testID}>
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel ?? placeholder}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          className="bg-base-white h-12 flex-row items-center rounded-md border border-gray-300 px-3"
          testID={`${testID}-trigger`}
          onPress={handleOpen}
        >
          <Text className={cn('flex-1', value ? 'text-gray-800' : 'text-gray-400')} numberOfLines={1} type="body1">
            {value?.label ?? placeholder}
          </Text>
          <Icon className="text-gray-600" name="chevron-down" size={24} />
        </Pressable>
      </View>

      {shouldRenderModal ? (
        <Modal
          transparent
          animationType="none"
          testID={`${testID}-modal`}
          visible={isOpen}
          onRequestClose={() => setIsOpen(false)}
        >
          <TouchableWithoutFeedback testID={`${testID}-overlay`} onPress={() => setIsOpen(false)}>
            <View className="flex-1">
              <Animated.View
                className="rounded-md border border-gray-100"
                style={[animatedStyle, { position: 'absolute', ...menuStyle }]}
                testID={`${testID}-menu`}
              >
                <View className="bg-base-white rounded-md py-2" style={shadowCard.md} testID={`${testID}-menu-card`}>
                  {options.map((option) => (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{ selected: option.value === value?.value }}
                      className="min-h-12 justify-center px-4 py-3"
                      testID={`${testID}-option-${option.value}`}
                      onPress={() => handleSelect(option)}
                    >
                      <Text className="text-gray-800" type="body1">
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </>
  )
}
