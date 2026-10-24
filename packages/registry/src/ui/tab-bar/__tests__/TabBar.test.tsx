import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'

jest.mock('../components/TabItem', () => {
  const { Text, View } = require('react-native')

  return function TabItem({ label, onPress, badge, icons, testID }: any) {
    return (
      <View testID={testID || 'tab-item'}>
        <Text>{typeof label === 'string' ? label : 'Tab'}</Text>
        <Text testID="tab-badge">{String(badge)}</Text>
        <Text testID="tab-icons">{icons ? icons.active : 'none'}</Text>
        <Text testID="tab-press" onPress={onPress}>
          Press
        </Text>
      </View>
    )
  }
})

import { TabBar } from '../TabBar'
import type { TabBarNavigation } from '../TabBar.types'

const ReactNative = require('react-native')
const mockUseWindowDimensions = jest.fn(() => ({ width: 400, height: 800 }))

ReactNative.useWindowDimensions = mockUseWindowDimensions

describe('TabBar', () => {
  const state = {
    index: 0,
    routes: [
      { key: 'home', name: 'HomeTab', params: {} },
      { key: 'notifications', name: 'Notifications', params: { id: 1 } },
    ],
  }

  const descriptors = {
    home: { options: { tabBarLabel: 'Home' } },
    notifications: { options: { title: 'Avisos' } },
  }

  const icons = {
    HomeTab: { active: 'home-05-filled', inactive: 'home-05' },
    Notifications: { active: 'bell-03-filled', inactive: 'bell-03', badge: 'bell-notification' },
  } as const

  const navigation = {
    dispatch: jest.fn<TabBarNavigation['dispatch']>(),
    emit: jest.fn<TabBarNavigation['emit']>(() => ({ defaultPrevented: false })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseWindowDimensions.mockReturnValue({ width: 400, height: 800 })
  })

  const renderBar = (props: Partial<Parameters<typeof TabBar>[0]> = {}) =>
    render(
      <TabBar
        descriptors={descriptors}
        icons={icons}
        navigation={navigation}
        state={state}
        {...props}
      />,
    )

  it('should render tabs', () => {
    const { getAllByTestId } = renderBar()

    expect(getAllByTestId('tab-item')).toHaveLength(2)
  })

  it('should resolve label from tabBarLabel, then title, then route name', () => {
    const { getByText } = renderBar({
      state: { index: 0, routes: [...state.routes, { key: 'profile', name: 'Profile' }] },
    })

    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Avisos')).toBeTruthy()
    expect(getByText('Profile')).toBeTruthy()
  })

  it('should emit tabPress on press', () => {
    const { getAllByTestId } = renderBar()

    fireEvent.press(getAllByTestId('tab-press')[0])

    expect(navigation.emit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'home',
      canPreventDefault: true,
    })
  })

  it('should dispatch a JUMP_TO action when tab is not focused', () => {
    const { getAllByTestId } = renderBar()

    fireEvent.press(getAllByTestId('tab-press')[1])

    expect(navigation.dispatch).toHaveBeenCalledWith({
      type: 'JUMP_TO',
      payload: { name: 'Notifications', params: { id: 1 } },
    })
  })

  it('should not navigate when tab is focused', () => {
    const { getAllByTestId } = renderBar()

    fireEvent.press(getAllByTestId('tab-press')[0])

    expect(navigation.dispatch).not.toHaveBeenCalled()
  })

  it('should not navigate when the tabPress event is prevented', () => {
    navigation.emit.mockReturnValueOnce({ defaultPrevented: true })
    const { getAllByTestId } = renderBar()

    fireEvent.press(getAllByTestId('tab-press')[1])

    expect(navigation.dispatch).not.toHaveBeenCalled()
  })

  it('should pass badges and icons by route name', () => {
    const { getAllByTestId } = renderBar({ badges: { Notifications: 3 } })

    expect(getAllByTestId('tab-badge').map((n) => n.props.children)).toEqual(['undefined', '3'])
    expect(getAllByTestId('tab-icons').map((n) => n.props.children)).toEqual([
      'home-05-filled',
      'bell-03-filled',
    ])
  })

  it('should use tabBarButtonTestID from options', () => {
    const { getByTestId } = renderBar({
      descriptors: { ...descriptors, home: { options: { tabBarLabel: 'Home', tabBarButtonTestID: 'home-btn' } } },
    })

    expect(getByTestId('home-btn')).toBeTruthy()
  })

  it('should render the animated indicator', () => {
    const { getByTestId } = renderBar()

    expect(getByTestId('tab-bar-indicator')).toBeTruthy()
  })
})
