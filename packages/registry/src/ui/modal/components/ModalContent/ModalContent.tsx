import React from 'react'
import { View } from 'react-native'
import { FeaturedIcon } from '@farma/registry/ui/featured-icon'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'
import type { FeaturedIconProps } from '@farma/registry/ui/featured-icon'

interface ModalContentProps {
  preContent?: React.ReactNode
  icon?: FeaturedIconProps
  title?: string
  description?: string
  formattedDescription?: React.ReactNode
  textSpacing?: boolean
}

export const ModalContent: React.FC<ModalContentProps> = ({
  preContent,
  icon,
  title,
  description,
  formattedDescription,
  textSpacing = false,
}) => {
  const descriptionContent =
    formattedDescription ??
    (description ? (
      <Text accessibilityRole="text" className="text-center text-gray-800" type="body1">
        {description}
      </Text>
    ) : null)

  return (
    <>
      {preContent && <View className="mb-4">{preContent}</View>}
      {icon && !preContent && (
        <View accessible={false} className="mb-4" importantForAccessibility="no-hide-descendants">
          <FeaturedIcon {...icon} />
        </View>
      )}
      <View className={cn('w-full items-center gap-2', textSpacing && 'gap-2')}>
        {title && (
          <Text accessibilityRole="header" className="text-center text-gray-800" type="h1">
            {title}
          </Text>
        )}
        {descriptionContent}
      </View>
    </>
  )
}
