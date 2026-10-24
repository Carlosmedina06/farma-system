import type { IconName } from '@farma/registry/ui/icon'

export type ButtonGroupItem = {
  id: string
  text?: string
  icon?: IconName
  onPress: () => void
}

export type ButtonItem = {
  text?: string
  icon?: IconName
  index: number
  totalItems: number
  hasIcon: boolean
  onPress: () => void
  testID?: string
}

export interface ButtonGroupProps {
  buttons: ButtonGroupItem[]
  testID?: string
}

type ButtonPosition = 'first' | 'middle' | 'last'

export const getButtonPossition = (index: number, totalItems: number): ButtonPosition => {
  if (index === 0) {
    return 'first'
  }
  if (index === totalItems - 1) {
    return 'last'
  }

  return 'middle'
}

export const findIconInButtons = (buttonList: ButtonGroupItem[]) =>
  buttonList.some((item) => item.icon)
