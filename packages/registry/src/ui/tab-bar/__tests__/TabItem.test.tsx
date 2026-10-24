import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

import TabItem from '../components/TabItem'

jest.mock('../components/TabIcon', () => {
  const { View } = require('react-native')

  return function TabIcon({ icons, badge }: any) {
    return <View testID={`tab-icon-${icons?.active ?? 'none'}-${String(badge)}`} />
  }
})

jest.mock('../components/TabLabel', () => {
  const { Text } = require('react-native')

  return function TabLabel({ label }: any) {
    return <Text testID="tab-label">{typeof label === 'string' ? label : 'Tab'}</Text>
  }
})

describe('TabItem', () => {
  const route = { key: 'home', name: 'HomeTab', params: {} }
  const icons = { active: 'home-05-filled', inactive: 'home-05' } as const

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render tab icon', () => {
    const { getByTestId } = render(
      <TabItem icons={icons} isFocused={false} label="Home" route={route} onPress={jest.fn()} />,
    )

    expect(getByTestId('tab-icon-home-05-filled-undefined')).toBeTruthy()
  })

  it('should render tab label', () => {
    const { getByTestId } = render(
      <TabItem icons={icons} isFocused={false} label="Home" route={route} onPress={jest.fn()} />,
    )

    expect(getByTestId('tab-label')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <TabItem icons={icons} isFocused={false} label="Home" route={route} onPress={onPress} />,
    )

    fireEvent.press(getByTestId('tab-item-pressable'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should pass badge to TabIcon', () => {
    const { getByTestId } = render(
      <TabItem badge icons={icons} isFocused={false} label="Home" route={route} onPress={jest.fn()} />,
    )

    expect(getByTestId('tab-icon-home-05-filled-true')).toBeTruthy()
  })

  it('should expose tab accessibility role, selected state and label', () => {
    const { getByTestId } = render(
      <TabItem
        isFocused
        accessibilityLabel="Inicio"
        icons={icons}
        label="Home"
        route={route}
        onPress={jest.fn()}
      />,
    )

    const pressable = getByTestId('tab-item-pressable')

    expect(pressable.props.accessibilityRole).toBe('tab')
    expect(pressable.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }))
    expect(pressable.props.accessibilityLabel).toBe('Inicio')
  })
})
