import { Pressable, TouchableOpacity, View } from 'react-native'
import Toast, { type ToastConfig } from 'react-native-toast-message'
import { tv } from 'tailwind-variants'

import { cn } from '@farma/registry/lib/utils'
import { Icon, type IconName } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

export enum ToastType {
  Success = 'Success',
  Error = 'Error',
  Default = 'Default',
  DefaultSuccess = 'DefaultSuccess',
}

export type ShowToastProps = {
  text?: string
  type?: ToastType
  actionText?: string
  onPressAction?: () => void
  withIcon?: boolean
  withCloseIcon?: boolean
  icon?: IconName
  /** Tamaño del ícono de `withIcon`. Default 20. */
  iconSize?: number
  closeLabel?: string
  /** Clases extra para el contenedor (ej. otro margen lateral: `mx-padding-xl`). */
  className?: string
  position?: 'top' | 'bottom'
  /** Milisegundos visible. Default 4000. */
  duration?: number
}

const DEFAULT_DURATION = 4000

const iconMapper: Record<ToastType, IconName> = {
  [ToastType.Success]: 'check-circle',
  [ToastType.Default]: 'info-circle',
  [ToastType.Error]: 'info-circle',
  [ToastType.DefaultSuccess]: 'check-circle',
}

const toastVariants = tv({
  base: 'self-stretch mx-padding-4xl rounded-md min-h-[48px] px-4 py-3 flex-row items-center justify-between gap-2.5 border-l-4 shadow-lg',
  variants: {
    type: {
      [ToastType.Default]: 'bg-gray-800 border-l-gray-800',
      [ToastType.Error]: 'bg-error-600 border-l-error-600',
      [ToastType.Success]: 'bg-success-600 border-l-success-600',
      [ToastType.DefaultSuccess]: 'bg-gray-800 border-l-gray-800',
    },
  },
})

function ToastView({
  text,
  type = ToastType.Default,
  actionText,
  onPressAction,
  withIcon = false,
  withCloseIcon = false,
  icon,
  iconSize = 20,
  closeLabel = 'Cerrar',
  className,
}: Omit<ShowToastProps, 'position' | 'duration'>) {
  return (
    <Pressable
      className={cn(toastVariants({ type }), className)}
      style={{
        shadowColor: '#00000017',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
      testID="toast"
      onPress={() => Toast.hide()}
    >
      <View className="flex-shrink flex-row items-center gap-2">
        {withIcon && <Icon color="#FFFFFF" name={icon ?? iconMapper[type]} size={iconSize} />}
        <Text className="flex-shrink text-white" type="body2">
          {text}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {!!actionText && (
          <TouchableOpacity testID="toast-action" onPress={onPressAction}>
            <Text className="text-sm font-semibold text-white" type="body1">
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
        {withCloseIcon && (
          <TouchableOpacity
            accessibilityLabel={closeLabel}
            accessibilityRole="button"
            testID="toast-close"
            onPress={() => Toast.hide()}
          >
            <Icon color="#FFFFFF" name="x-close" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  )
}

const toastConfig: ToastConfig = Object.fromEntries(
  Object.values(ToastType).map((type) => [type, ({ props }: { props: ShowToastProps }) => <ToastView {...props} />]),
)

export type ToastHostProps = {
  topOffset?: number
  bottomOffset?: number
}

export function ToastHost({ topOffset, bottomOffset }: ToastHostProps) {
  return <Toast bottomOffset={bottomOffset} config={toastConfig} position="top" topOffset={topOffset} />
}

export const toast = {
  show({ type = ToastType.Default, position = 'top', duration, ...viewProps }: ShowToastProps) {
    Toast.show({
      type,
      props: { ...viewProps, type },
      position,
      visibilityTime: duration ?? DEFAULT_DURATION,
      autoHide: true,
      swipeable: false,
    })
  },
  hide() {
    Toast.hide()
  },
}

export const showToast = toast.show
