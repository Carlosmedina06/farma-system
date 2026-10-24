import { ViewProps } from 'react-native'

export interface ITab {
  key: string | number
  title: string
  isDisabled?: boolean
}

export interface TabsProps extends ViewProps {
  tabs: ITab[]
  selected: ITab['key']
  onChange: (key: ITab['key']) => void
  className?: string
  testID?: string
}
