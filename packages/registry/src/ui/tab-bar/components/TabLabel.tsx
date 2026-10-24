import { Text } from '@farma/registry/ui/text'

import type { TabBarLabel } from '../TabBar.types'

const ACTIVE_COLOR = '#3b4aca'
const INACTIVE_COLOR = '#475467'

type TabLabelProps = {
  label: TabBarLabel
  isFocused: boolean
  /** Nombre de la ruta, se pasa como `children` a un label función. */
  routeName?: string
}

const TabLabel = ({ label, isFocused, routeName = '' }: TabLabelProps) => {
  if (typeof label === 'function') {
    return (
      <>
        {label({
          focused: isFocused,
          color: isFocused ? ACTIVE_COLOR : INACTIVE_COLOR,
          position: 'below-icon',
          children: routeName,
        })}
      </>
    )
  }

  const textColor = isFocused ? 'text-primary-700' : 'text-gray-600'

  return (
    <Text className={textColor} type="navbar">
      {label}
    </Text>
  )
}

export default TabLabel
