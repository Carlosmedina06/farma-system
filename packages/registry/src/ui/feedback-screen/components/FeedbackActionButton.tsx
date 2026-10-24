import type { ButtonType } from '@farma/registry/ui/button'
import type { FeedbackAction } from '../types/FeedbackScreen.types'

import { Button } from '@farma/registry/ui/button'

interface FeedbackActionVariantStyle {
  className: string
  color: string
  testID: string
  type?: ButtonType
}

const VARIANT_STYLE: Record<'primary' | 'secondary', FeedbackActionVariantStyle> = {
  primary: {
    className: 'bg-base-white',
    color: 'text-gray-900',
    testID: 'feedback-primary-button',
  },
  secondary: {
    className: 'bg-transparent',
    color: 'text-base-white',
    testID: 'feedback-secondary-button',
    type: 'tertiary',
  },
}

interface FeedbackActionButtonProps {
  readonly action?: FeedbackAction
  readonly variant: 'primary' | 'secondary'
  readonly onPress: () => void
}

export default function FeedbackActionButton({
  action,
  variant,
  onPress,
}: Readonly<FeedbackActionButtonProps>) {
  if (!action || action.hidden) {
    return null
  }

  const variantStyle = VARIANT_STYLE[variant]
  const usesDefaultLook = !action.type

  return (
    <Button
      className={action.className ?? (usesDefaultLook ? variantStyle.className : undefined)}
      color={action.color ?? (usesDefaultLook ? variantStyle.color : undefined)}
      testID={variantStyle.testID}
      type={action.type ?? variantStyle.type}
      onPress={onPress}
    >
      {action.label}
    </Button>
  )
}
