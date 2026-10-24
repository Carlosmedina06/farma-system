import { Modal, Pressable, View } from 'react-native'
import { getWP } from '@farma/registry/lib/dimensions'
import type { FeaturedIconProps } from '@farma/registry/ui/featured-icon'
import type { ButtonProps } from '@farma/registry/ui/button'
import { ButtonSectionLayout } from '@farma/registry/ui/button-section-layout'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'
import { FeaturedIcon } from '@farma/registry/ui/featured-icon'

interface CompactModalProps {
  isVisible: boolean
  primaryAction: Omit<ButtonProps, 'size'>
  secondaryAction: Omit<ButtonProps, 'size'>
  title: string
  primaryDescription: string
  secondaryDescription: string
  formattedDescription: React.ReactNode
  icon: FeaturedIconProps
  isLoading?: boolean
  customClose?: () => void
  close?: () => void
  testID?: string
}

const CompactModal = ({
  isVisible,
  primaryAction,
  secondaryAction,
  title,
  primaryDescription,
  formattedDescription,
  secondaryDescription,
  icon,
  isLoading = false,
  customClose,
  close,
  testID = 'compact-modal',
}: CompactModalProps) => {
  return (
    <Modal transparent animationType="fade" testID={testID} visible={isVisible}>
      <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <View
          className="bg-base-white items-center gap-4 rounded-md px-6 py-6"
          style={{
            width: getWP(85),
            maxWidth: 400,
          }}
        >
          <Pressable
            className="absolute top-4 right-4 z-1 items-center justify-center p-3"
            testID={`${testID}-close`}
            onPress={customClose || close || secondaryAction?.onPress}
          >
            <Icon color="#475467" name="x-close" size={24} />
          </Pressable>
          <View className="h-[60px] w-[60px] items-center justify-center gap-2">
            {icon && <FeaturedIcon {...{ ...icon, fullScreen: true }} />}
          </View>
          {formattedDescription && (
            <View className="mb-2 items-center gap-2 px-6">{formattedDescription}</View>
          )}

          {!formattedDescription && (
            <Text semibold className="text-center leading-8" type="h1">
              {title}
            </Text>
          )}

          {!formattedDescription && (
            <View className="items-center px-6">
              <Text className="text-center text-gray-800" numberOfLines={2} type="body1">
                {primaryDescription}
              </Text>
              <Text className="mb-2 text-center text-gray-800" type="body1">
                {secondaryDescription}
              </Text>
            </View>
          )}

          <View className="w-full">
            <ButtonSectionLayout
              primaryButton={{
                disabled: isLoading,
                loading: isLoading,
                children: primaryAction?.children || '',
                type: 'primary',
                onPress: primaryAction?.onPress || undefined,
              }}
              secondaryButton={{
                disabled: isLoading,
                loading: isLoading,
                children: secondaryAction?.children || '',
                type: 'textLink',
                onPress: secondaryAction?.onPress || undefined,
              }}
              variant={secondaryAction ? 'verticalTwoButtons' : 'verticalSingleButton'}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default CompactModal
