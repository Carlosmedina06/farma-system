import { View } from 'react-native'
import { ScreenLayout } from '@farma/registry/ui/screen-layout'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import type { EmptyStateProps } from './EmptyState.types'

/** Estado vacío: ilustración opcional + título y texto secundario centrados. */
export const EmptyState = ({
  illustration,
  content,
  className,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'text',
  ...props
}: EmptyStateProps) => {
  const resolvedAccessibilityLabel =
    accessibilityLabel ?? [content?.title, content?.label].filter(Boolean).join('. ')

  return (
    <ScreenLayout className={cn('flex-1 items-center', className)} testID={testID}>
      <View
        {...props}
        accessible
        accessibilityHint={accessibilityHint}
        accessibilityLabel={resolvedAccessibilityLabel}
        accessibilityRole={accessibilityRole}
        className="gap-gap-xl py-spacing-5 items-center self-stretch"
      >
        {illustration ? (
          <View accessible={false} importantForAccessibility="no-hide-descendants">
            {illustration}
          </View>
        ) : null}
        {!!(content?.title || content?.label) && (
          <View className="gap-gap-xxs items-center self-stretch">
            {!!content?.title && (
              <Text accessible={false} className="text-center text-gray-800" maxFontSizeMultiplier={1.5} type="h3">
                {content.title}
              </Text>
            )}
            {!!content?.label && (
              <Text accessible={false} className="text-center text-gray-600" maxFontSizeMultiplier={1.5} type="body2">
                {content.label}
              </Text>
            )}
          </View>
        )}
      </View>
    </ScreenLayout>
  )
}

export default EmptyState
