import { Dimensions, type ViewStyle } from 'react-native'

interface ComputeDropdownPositionParams {
  pageX: number
  pageY: number
  width: number
  height: number
  optionsCount: number
  bottomBoundaryOffset?: number
}

export default function computeDropdownPosition({
  pageX,
  pageY,
  width,
  height,
  optionsCount,
  bottomBoundaryOffset = 0,
}: ComputeDropdownPositionParams): ViewStyle {
  const screenHeight = Dimensions.get('window').height
  const screenWidth = Dimensions.get('window').width
  const optionRowHeight = 44
  const verticalPadding = 16
  const dropdownHeight = optionsCount * optionRowHeight + verticalPadding
  const screenPadding = 8

  const availableBottomSpace = screenHeight - (pageY + height) - bottomBoundaryOffset
  const offsetY = height > 60 ? height * 0.3 : height + 4

  const desiredTopPosition =
    dropdownHeight > availableBottomSpace ? pageY - dropdownHeight : pageY + offsetY
  const maxTopPosition = screenHeight - bottomBoundaryOffset - dropdownHeight - screenPadding
  const constrainedTopPosition = Math.max(screenPadding, Math.min(desiredTopPosition, maxTopPosition))

  const distanceFromRight = screenWidth - (pageX + width)
  let dropdownPosition: { right?: number; left?: number }

  if (distanceFromRight < 20) {
    dropdownPosition = { right: 16 }
  } else if (distanceFromRight < 33) {
    dropdownPosition = { right: 32 }
  } else if (distanceFromRight < 50) {
    dropdownPosition = { left: pageX * 0.811 }
  } else {
    dropdownPosition = { left: pageX }
  }

  return {
    ...dropdownPosition,
    top: constrainedTopPosition,
  }
}
