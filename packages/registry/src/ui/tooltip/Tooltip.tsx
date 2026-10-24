import React, { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  type ViewInstance,
} from 'react-native'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { TooltipProps, ElementDistance } from './Tooltip.types'

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  supportingText,
  close = true,
  className,
  testID,
}) => {
  const buttonRef = useRef<React.ElementRef<typeof TouchableOpacity>>(null)
  const modalRef = useRef<ViewInstance>(null)

  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [stylesTooltip, setStylesTooltip] = useState<ViewStyle>({})
  const [elementHeight, setElementHeight] = useState<number>(0)
  const [elementDistance, setElementDistance] = useState<ElementDistance>({
    distanceFromRight: 0,
    distanceFromLeft: 0,
  })

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((_, __, width: number, height: number, ___, py: number) => {
        const screenHeight = Dimensions.get('window').height
        const distanceFromBottom = screenHeight - (py + height)
        const margin = py - elementHeight - 8
        const openToTop = elementHeight + 16 > distanceFromBottom ? margin : py + height

        if (elementDistance.distanceFromRight < width) {
          setStylesTooltip({
            right: 16,
            top: openToTop,
          })
        } else {
          setStylesTooltip({
            left: elementDistance.distanceFromLeft,
            top: openToTop,
          })
        }

        setShowTooltip(true)
      })
    }
  }

  const handleOutsidePress = () => {
    setShowTooltip(false)
  }

  useEffect(() => {
    setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.measure((_, __, ___, height: number, ____, _____) => {
          setElementHeight(height)
        })
      }
    }, 0)
  }, [showTooltip])

  useEffect(() => {
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.measure((_, __, width: number, ___, px: number, ____) => {
          const screenWidth = Dimensions.get('window').width
          const distanceRight = screenWidth - (px + width)

          setElementDistance({
            distanceFromRight: distanceRight,
            distanceFromLeft: px,
          })
        })
      }
    }, 0)
  }, [])

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        testID={testID ? `${testID}-trigger` : 'tooltip-trigger'}
        onPress={handlePress}
      >
        {children}
      </TouchableOpacity>
      {showTooltip && (
        <Modal
          transparent
          animationType="none"
          testID={testID ? `${testID}-modal` : 'tooltip-modal'}
          visible={showTooltip}
          onRequestClose={handleOutsidePress}
        >
          <TouchableWithoutFeedback
            testID={testID ? `${testID}-backdrop` : 'tooltip-backdrop'}
            onPress={handleOutsidePress}
          >
            <View className="flex-1">
              <TouchableWithoutFeedback testID={testID ? `${testID}-content` : 'tooltip-content'}>
                <View
                  ref={modalRef}
                  className={cn(
                    'absolute mt-1 w-auto max-w-[150px] gap-0.5 rounded-sm bg-gray-900 p-3',
                    className,
                  )}
                  style={stylesTooltip}
                  testID={testID}
                >
                  <View className="flex-row items-center justify-between">
                    <Text semibold className="text-white" type="caption">
                      {text}
                    </Text>
                    {close && (
                      <TouchableOpacity
                        testID={testID ? `${testID}-close` : 'tooltip-close'}
                        onPress={handleOutsidePress}
                      >
                        <Icon color="#FFFFFF" name="x-close" />
                      </TouchableOpacity>
                    )}
                  </View>
                  {supportingText && (
                    <Text className="text-white" type="caption">
                      {supportingText}
                    </Text>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  )
}

export default Tooltip
