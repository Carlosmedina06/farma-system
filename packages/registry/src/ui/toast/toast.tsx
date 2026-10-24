import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp, FadeOut, LinearTransition, ReduceMotion } from 'react-native-reanimated'
import { tv } from 'tailwind-variants'

import { createStore, useStore } from '@farma/registry/lib/store'
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
  onClose,
}: Omit<ShowToastProps, 'position' | 'duration'> & { onClose: () => void }) {
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
      onPress={onClose}
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
            onPress={onClose}
          >
            <Icon color="#FFFFFF" name="x-close" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  )
}

/** Cantidad máxima de toasts visibles a la vez; al llegar uno más se descarta el más viejo. */
export const MAX_VISIBLE_TOASTS = 3

type ToastItem = ShowToastProps & { id: number }

const toastStore = createStore<ToastItem[]>([])
const timers = new Map<number, ReturnType<typeof setTimeout>>()
let nextId = 0

const removeToast = (id: number) => {
  clearTimeout(timers.get(id))
  timers.delete(id)
  toastStore.set((items) => items.filter((item) => item.id !== id))
}

const styles = StyleSheet.create({ stack: { position: 'absolute', left: 0, right: 0 } })

/** Opacidad según la antigüedad: el más nuevo se ve entero y los de atrás se atenúan. */
const STACK_OPACITY = [1, 0.85, 0.7]

export type ToastHostProps = {
  /** Distancia desde arriba de la pila `top` (ej. alto del header de la app). */
  topOffset?: number
  /** Distancia desde abajo de la pila `bottom`. */
  bottomOffset?: number
}

function ToastStack({ items, position, offset }: { items: ToastItem[]; position: 'top' | 'bottom'; offset: number }) {
  if (items.length === 0) return null

  return (
    <View
      pointerEvents="box-none"
      style={[styles.stack, position === 'top' ? { top: offset } : { bottom: offset }]}
      testID={`toast-stack-${position}`}
    >
      {items.map(({ id, position: _position, duration: _duration, ...viewProps }, index) => (
        <Animated.View
          key={id}
          entering={(position === 'top' ? FadeInDown : FadeInUp).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.reduceMotion(ReduceMotion.System)}
          layout={LinearTransition.springify().reduceMotion(ReduceMotion.System)}
          style={{ marginTop: index === 0 ? 0 : 8 }}
        >
          <View style={{ opacity: STACK_OPACITY[items.length - 1 - index] ?? 1 }}>
            <ToastView {...viewProps} onClose={() => removeToast(id)} />
          </View>
        </Animated.View>
      ))}
    </View>
  )
}

/**
 * Capa imperativa OPCIONAL: montá un `<ToastHost />` una vez en el root y llamá `toast.show()`.
 * Muestra hasta `MAX_VISIBLE_TOASTS` apilados: el más nuevo abajo, los anteriores suben
 * y el más viejo desaparece cuando llega uno más. Sin host, `toast.show()` no se ve.
 */
export function ToastHost({ topOffset = 60, bottomOffset = 40 }: ToastHostProps) {
  const items = useStore(toastStore)

  return (
    <>
      <ToastStack items={items.filter((item) => (item.position ?? 'top') === 'top')} offset={topOffset} position="top" />
      <ToastStack items={items.filter((item) => item.position === 'bottom')} offset={bottomOffset} position="bottom" />
    </>
  )
}

export const toast = {
  /** Muestra un toast y devuelve su id. */
  show({ type = ToastType.Default, position = 'top', duration, ...viewProps }: ShowToastProps) {
    nextId += 1
    const id = nextId
    toastStore.set((items) => {
      const next = [...items, { ...viewProps, type, position, id }]
      next.slice(0, Math.max(0, next.length - MAX_VISIBLE_TOASTS)).forEach((old) => {
        clearTimeout(timers.get(old.id))
        timers.delete(old.id)
      })
      return next.slice(-MAX_VISIBLE_TOASTS)
    })
    timers.set(id, setTimeout(() => removeToast(id), duration ?? DEFAULT_DURATION))
    return id
  },
  /** Oculta un toast por id, o todos si no se pasa id. */
  hide(id?: number) {
    if (id !== undefined) return removeToast(id)
    timers.forEach(clearTimeout)
    timers.clear()
    toastStore.set([])
  },
}

/** Alias compatible con la API anterior de app-mobile. */
export const showToast = toast.show
