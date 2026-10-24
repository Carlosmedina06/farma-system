import { Dimensions, type ViewStyle } from 'react-native'

export function getSelectMenuPosition(
  pageX: number,
  pageY: number,
  width: number,
  height: number,
  optionCount: number,
): ViewStyle {
  const screenHeight = Dimensions.get('window').height
  const optionHeight = 48
  const menuHeight = optionCount * optionHeight + 16
  const spaceBelow = screenHeight - (pageY + height)
  // Gap 0 so the popover sits flush under the trigger and covers the helper text.
  const top = spaceBelow < menuHeight ? Math.max(8, pageY - menuHeight) : pageY + height

  return { top, left: pageX, width }
}

export function getSelectMenuFallbackStyle(): ViewStyle {
  return {
    top: 120,
    left: 16,
    width: Dimensions.get('window').width - 32,
  }
}

type MeasurableNode = {
  measureInWindow?: (callback: (pageX: number, pageY: number, width: number, height: number) => void) => void
}

export function openSelectMenuAtNode(
  node: MeasurableNode | null,
  optionCount: number,
  onOpen: (style: ViewStyle) => void,
): void {
  const fallbackStyle = getSelectMenuFallbackStyle()

  if (!node?.measureInWindow) {
    onOpen(fallbackStyle)

    return
  }

  let didMeasure = false

  node.measureInWindow((pageX, pageY, width, height) => {
    didMeasure = true
    onOpen(getSelectMenuPosition(pageX, pageY, width, height, optionCount))
  })

  requestAnimationFrame(() => {
    if (!didMeasure) {
      onOpen(fallbackStyle)
    }
  })
}
