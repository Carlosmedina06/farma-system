import { Fragment } from 'react'
import { ScrollView } from 'react-native'

export type BottomSheetCloseControl = 'pill' | 'x' | 'both'

export type BottomSheetProps = {
  open: boolean
  close: () => void
  onCloseIconPress?: () => void
  title?: string
  children?: React.ReactNode
  content?: typeof ScrollView | typeof Fragment
  full?: boolean
  heightPercent?: number
  divider?: boolean
  hideTitle?: boolean
  closeControl?: BottomSheetCloseControl
  closeIconTestID?: string
  closeAccessibilityLabel?: string
  closeAccessibilityHint?: string
  testID?: string
}
