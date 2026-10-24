import { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from '@farma/registry/ui/button'
import { ShimmerSkeleton } from '@farma/registry/ui/shimmer-skeleton'
import { Text } from '@farma/registry/ui/text'

import { ButtonSectionProps } from './ButtonSectionLayout.types'
import { formatAmountValue, showFormattedOrZero } from './ButtonSectionLayout.utils'

type AmountRowProps = Pick<
  ButtonSectionProps,
  'amountText' | 'amountValue' | 'isLoading' | 'formatAmount'
> & {
  /** Si el monto no es numérico, se muestra tal cual en lugar de ocultarlo. */
  fallbackToRaw?: boolean
}

export const AmountRow = ({
  amountText,
  amountValue,
  isLoading,
  formatAmount,
  fallbackToRaw,
}: AmountRowProps) => {
  const showFormatted = showFormattedOrZero(amountValue)
  const showRaw = fallbackToRaw && !showFormatted && amountValue != null && amountValue !== ''

  return (
    <View className="flex-row justify-between">
      {amountText ? (
        <Text semibold type="body1">
          {amountText}
        </Text>
      ) : null}
      {showFormatted ? (
        <Text semibold type="body1">
          {isLoading ? (
            <ShimmerSkeleton colorMode="light" height={20} width={100} />
          ) : (
            formatAmountValue(amountValue, formatAmount)
          )}
        </Text>
      ) : null}
      {showRaw ? (
        <Text semibold type="body1">
          {amountValue}
        </Text>
      ) : null}
    </View>
  )
}

export const LinkPromptRow = ({
  promptText,
  linkText,
  onPress,
  disabled,
  testID = 'button-section-link-prompt',
}: {
  promptText?: ReactNode
  linkText?: ReactNode
  onPress?: () => void
  disabled?: boolean
  testID?: string
}) => (
  <View className="min-h-[56px] items-center justify-center">
    <Pressable
      accessibilityRole="button"
      className="gap-gap-xs flex-row items-center justify-center"
      disabled={disabled}
      testID={testID}
      onPress={onPress}
    >
      {promptText ? (
        <Text className="text-gray-800" type="body1">
          {promptText}
        </Text>
      ) : null}
      {linkText ? (
        <Text semibold className="text-primary-600" type="body1">
          {linkText}
        </Text>
      ) : null}
    </Pressable>
  </View>
)

export const TwoButtonsVertical = ({
  primaryButton,
  secondaryButton,
  full,
  testID = 'button-section',
}: Pick<ButtonSectionProps, 'primaryButton' | 'secondaryButton' | 'testID'> & {
  full?: boolean
}) => (
  <View className="gap-2">
    {[primaryButton, secondaryButton].map((button, index) =>
      button ? (
        <Button
          key={button.id ?? `btn-${index}`}
          {...button}
          full={full ?? button.full}
          testID={button.testID ?? `${testID}-${index === 0 ? 'primary' : 'secondary'}-button`}
        >
          {button.children}
        </Button>
      ) : null,
    )}
  </View>
)
