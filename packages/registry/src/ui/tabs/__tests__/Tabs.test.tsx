import { describe, expect, it, jest } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'

import { Tabs } from '../Tabs'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  return {
    default: {
      View: AnimatedView,
      createAnimatedComponent: (Component: any) => Component,
    },
    View: AnimatedView,
    createAnimatedComponent: jest.fn((Component: any) => Component),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value: any) => value),
  }
})

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, ...props }: any) {
    return <Text {...props}>{children}</Text>
  }
})()
  return { Text: mod?.default ?? mod }
})

describe('Tabs', () => {
  const mockTabs = [
    { key: 'tab1', title: 'Tab 1' },
    { key: 'tab2', title: 'Tab 2' },
    { key: 'tab3', title: 'Tab 3' },
  ]

  it('should render with tabs', () => {
    const { getByText, getByTestId } = render(
      <Tabs selected="tab1" tabs={mockTabs} testID="tabs" onChange={jest.fn()} />,
    )

    expect(getByTestId('tabs')).toBeTruthy()
    expect(getByText('Tab 1')).toBeTruthy()
    expect(getByText('Tab 2')).toBeTruthy()
    expect(getByText('Tab 3')).toBeTruthy()
  })

  it('should call onChange when tab is pressed', () => {
    const mockOnChange = jest.fn()
    const { getByText } = render(
      <Tabs selected="tab1" tabs={mockTabs} testID="tabs" onChange={mockOnChange} />,
    )

    act(() => {
      fireEvent.press(getByText('Tab 2'))
    })

    expect(mockOnChange).toHaveBeenCalledWith('tab2')
  })

  it('should render with disabled tab', () => {
    const tabsWithDisabled = [
      { key: 'tab1', title: 'Tab 1' },
      { key: 'tab2', title: 'Tab 2', isDisabled: true },
    ]

    const { getByText } = render(
      <Tabs selected="tab1" tabs={tabsWithDisabled} testID="tabs" onChange={jest.fn()} />,
    )

    expect(getByText('Tab 2')).toBeTruthy()
  })

  it('should not call onChange when disabled tab is pressed', () => {
    const mockOnChange = jest.fn()
    const tabsWithDisabled = [
      { key: 'tab1', title: 'Tab 1' },
      { key: 'tab2', title: 'Tab 2', isDisabled: true },
    ]

    const { getByText } = render(
      <Tabs selected="tab1" tabs={tabsWithDisabled} testID="tabs" onChange={mockOnChange} />,
    )

    act(() => {
      fireEvent.press(getByText('Tab 2'))
    })

    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Tabs
        className="custom-class"
        selected="tab1"
        tabs={mockTabs}
        testID="tabs"
        onChange={jest.fn()}
      />,
    )

    expect(getByTestId('tabs')).toBeTruthy()
  })
})
