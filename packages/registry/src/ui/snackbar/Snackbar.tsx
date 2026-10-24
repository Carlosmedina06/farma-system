import { Pressable, TouchableOpacity, View } from 'react-native'
import { tv } from 'tailwind-variants'

import { cn } from '@farma/registry/lib/utils'
import { Icon, type IconName } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { SnackbarType, type SnackbarProps } from './Snackbar.types'

const iconMapper: { [key in SnackbarType]: IconName } = {
  [SnackbarType.Success]: 'check-circle',
  [SnackbarType.Default]: 'info-circle',
  [SnackbarType.Error]: 'info-circle',
  [SnackbarType.DefaultSuccess]: 'check-circle',
}

const snackbarContainerVariants = tv({
  base: 'absolute top-0 left-1.5 right-1.5 rounded-md min-h-[48px] px-4 py-3 flex-row items-center justify-between gap-2.5 border-l-4',
  variants: {
    type: {
      [SnackbarType.Default]: 'bg-gray-800 border-l-gray-800',
      [SnackbarType.Error]: 'bg-error-600 border-l-error-600',
      [SnackbarType.Success]: 'bg-success-600 border-l-success-600',
      [SnackbarType.DefaultSuccess]: 'bg-gray-800 border-l-gray-800',
    },
  },
})

/**
 * Snackbar presentacional. No sabe nada de cómo se muestra/oculta:
 * quien lo renderiza (ToastHost, la app) decide qué hacer en `onClose`.
 */
export const Snackbar = ({
  text,
  type = SnackbarType.Default,
  actionText,
  onPressAction,
  withIcon = false,
  withCloseIcon = false,
  icon,
  onClose,
  closeLabel = 'Cerrar',
  className,
  testID,
}: SnackbarProps) => (
  <Pressable
    className={cn(snackbarContainerVariants({ type }), 'shadow-lg', className)}
    style={{
      shadowColor: '#00000017',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    }}
    testID={testID ?? 'snackbar'}
    onPress={onClose}
  >
    <View className="flex-shrink flex-row items-center gap-2">
      {withIcon && <Icon color="#FFFFFF" name={icon ?? iconMapper[type]} size={20} />}
      <Text className="flex-shrink text-white" type="body2">
        {text}
      </Text>
    </View>

    <View className="flex-row items-center gap-2">
      {!!actionText && (
        <TouchableOpacity testID={testID ? `${testID}-action` : 'snackbar-action'} onPress={onPressAction}>
          <Text className="text-sm font-semibold text-white" type="body1">
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
      {withCloseIcon && (
        <TouchableOpacity
          accessibilityLabel={closeLabel}
          accessibilityRole="button"
          testID={testID ? `${testID}-close` : 'snackbar-close'}
          onPress={onClose}
        >
          <Icon color="#FFFFFF" name="x-close" size={24} />
        </TouchableOpacity>
      )}
    </View>
  </Pressable>
)
