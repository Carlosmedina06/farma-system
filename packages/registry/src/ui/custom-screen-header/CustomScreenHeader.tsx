import { useBackHandler } from '@react-native-community/hooks'
import { Platform, Pressable, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Icon, type IconName } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import { ActionProps, HeaderProps } from './CustomScreenHeader.types'

const backHitSlop = Platform.select({
  ios: { top: 20, bottom: 20, left: 0, right: 20 },
  default: { top: 25, bottom: 25, left: 25, right: 25 },
})

const HEADER_ICON_BOX_STYLE = {
  width: 44,
  height: 48,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
}

const HEADER_ICON_SLOT_STYLE = {
  width: 24,
  height: 24,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
}

const renderActionIcon = (name: IconName, amount?: number) => (
  <View className="relative">
    <Icon name={name} size={24} />
    {!!amount && (
      <View
        className="bg-primary-600 h-padding-3xl min-w-padding-3xl absolute -top-1.5 -right-2 items-center justify-center rounded-full px-0.5"
        pointerEvents="none"
      >
        <Text className="text-center text-xs font-bold text-white">{amount}</Text>
      </View>
    )}
  </View>
)

const renderActionContent = (action: ActionProps) => {
  if (action.customIcon) {
    return action.customIcon
  }

  if (!action.name) return null

  return renderActionIcon(action.name, action.amount)
}

export const CustomScreenHeader = ({
  title,
  actions,
  rightAction,
  onBack,
  backIcon,
  backIconSize,
  backAccessibilityLabel = 'Volver',
  backAccessibilityHint = 'Toque dos veces para regresar a la pantalla anterior',
  logo,
  subHeader,
  hideTopBar = false,
  handleHardwareBack = true,
  onHardwareBack,
  className,
  testID,
  style,
  ...props
}: HeaderProps) => {
  useBackHandler(() => {
    if (!handleHardwareBack) return false

    if (onHardwareBack) {
      return onHardwareBack() !== false
    }

    onBack?.()

    return true
  })

  const renderHeaderContent = () => {
    if (title) {
      return (
        <Text
          accessibilityRole="header"
          className="text-base-black flex-1"
          maxFontSizeMultiplier={1.5}
          numberOfLines={1}
          type="h3"
        >
          {title}
        </Text>
      )
    }

    if (logo) {
      return <View className="flex-1 justify-center">{logo}</View>
    }

    return <View className="flex-1" />
  }

  const topBar = hideTopBar ? null : (
    <View
      className={cn(
        'bg-base-white z-10 h-14 flex-row items-center gap-3',
        onBack ? 'px-padding-md' : 'px-padding-xl',
        className,
      )}
      style={style}
      testID={testID}
      {...props}
    >
      {onBack && (
        <Pressable
          accessibilityHint={backAccessibilityHint}
          accessibilityLabel={backAccessibilityLabel}
          accessibilityRole="button"
          hitSlop={backHitSlop}
          style={HEADER_ICON_BOX_STYLE}
          testID={testID ? `${testID}-back` : 'custom-screen-header-back'}
          onPress={onBack}
        >
          <View style={HEADER_ICON_SLOT_STYLE}>
            <Icon name={backIcon || 'chevron-left'} size={backIconSize || 24} />
          </View>
        </Pressable>
      )}

      {renderHeaderContent()}
      {actions?.map((action, index) => (
        <Pressable
          key={`${index}-${action.name ? String(action.name) : 'customIcon'}`}
          accessibilityLabel={action.accessibilityLabel ?? (action.name ? String(action.name) : 'Acción')}
          accessibilityRole="button"
          hitSlop={backHitSlop}
          style={HEADER_ICON_BOX_STYLE}
          testID={testID ? `${testID}-action-${index}` : `custom-screen-header-action-${index}`}
          onPress={action.onPress}
        >
          <View style={HEADER_ICON_SLOT_STYLE}>{renderActionContent(action)}</View>
        </Pressable>
      ))}
      {rightAction}
    </View>
  )

  if (!subHeader) return topBar

  return (
    <>
      {topBar}
      {subHeader}
    </>
  )
}

export default CustomScreenHeader
