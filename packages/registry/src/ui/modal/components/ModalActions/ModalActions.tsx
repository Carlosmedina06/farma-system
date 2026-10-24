import React from 'react'
import { View } from 'react-native'
import { EdgeInsets } from 'react-native-safe-area-context'
import { ButtonSectionLayout } from '@farma/registry/ui/button-section-layout'
import type { ButtonSectionVariant } from '@farma/registry/ui/button-section-layout'
import { cn } from '@farma/registry/lib/utils'

import { ModalActionProps } from '../../Modal.types'

interface ModalActionsProps {
  primaryAction?: ModalActionProps
  secondaryAction?: ModalActionProps
  variant?: ButtonSectionVariant
  fullScreen?: boolean
  insets: EdgeInsets
}

export const ModalActions: React.FC<ModalActionsProps> = ({
  primaryAction,
  secondaryAction,
  variant,
  fullScreen,
  insets,
}) => {
  if (!primaryAction && !secondaryAction) {
    return null
  }

  return (
    <View
      className={cn(
        'bg-base-white w-full',
        fullScreen && 'px-4 pb-4',
        !fullScreen && 'px-4 pb-6',
        !fullScreen && variant === 'verticalSingleButton' && 'pt-3',
        !fullScreen && variant !== 'verticalSingleButton' && 'pt-3',
      )}
      style={{
        paddingBottom: fullScreen ? Math.max(insets.bottom, 16) : undefined,
        paddingTop: !fullScreen && variant === 'verticalSingleButton' ? 12 : undefined,
      }}
    >
      <ButtonSectionLayout
        className={cn(
          'bg-base-white',
          fullScreen && 'px-4 pb-4',
          !fullScreen && 'px-4 pb-6',
          !fullScreen && variant === 'verticalSingleButton' && 'pt-3',
          !fullScreen && variant !== 'verticalSingleButton' && 'pt-3',
        )}
        primaryButton={primaryAction}
        secondaryButton={secondaryAction}
        variant={variant}
      />
    </View>
  )
}
