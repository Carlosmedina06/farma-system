import { useMemo } from 'react'
import { StyleSheet, View, ViewProps, type DimensionValue } from 'react-native'
import { tv } from 'tailwind-variants'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { ProgressProps } from './Progress.types'

const progressContainerVariants = tv({
  base: 'items-center',
  variants: {
    direction: {
      right: 'flex-row gap-3',
      bottom: 'flex-col items-end gap-2',
    },
  },
})

const barVariants = tv({
  base: 'h-2 bg-gray-200 rounded-lg',
  variants: {
    direction: {
      right: 'flex-1',
      bottom: 'w-full',
    },
  },
})

export const Progress = ({
  progress,
  direction = 'right',
  withLabel = false,
  className,
  testID,
  ...props
}: ProgressProps & ViewProps) => {
  const progressBarWidth = useMemo(() => (progress / 100) * 100 + '%', [progress])

  const progressLabel = useMemo(() => progressBarWidth, [progressBarWidth])

  return (
    <View
      {...props}
      className={cn(progressContainerVariants({ direction, className }))}
      testID={testID}
    >
      <View className={barVariants({ direction })}>
        <View
          className="bg-primary-600 h-2 rounded-lg"
          style={[
            StyleSheet.absoluteFill,
            {
              width: progressBarWidth as DimensionValue,
              maxWidth: progressBarWidth as DimensionValue,
            },
          ]}
        />
      </View>

      {withLabel && <Text>{progressLabel}</Text>}
    </View>
  )
}
