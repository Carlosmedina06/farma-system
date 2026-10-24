import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import { View, Text } from 'react-native'
import ScreenLayout from '../ScreenLayout'

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, edges, ...props }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return (
      <View testID="safe-area-view" edges={edges} {...props}>
        {children}
      </View>
    )
  },
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ScreenLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with children', () => {
    const { getByText } = render(
      <ScreenLayout>
        <Text>Test Content</Text>
      </ScreenLayout>,
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should render SafeAreaView', () => {
    const { getByTestId } = render(
      <ScreenLayout testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    expect(getByTestId('safe-area-view')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ScreenLayout className="custom-class" testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    expect(getByTestId('screen-layout')).toBeTruthy()
  })

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 }
    const { getByTestId } = render(
      <ScreenLayout style={customStyle} testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    const view = getByTestId('screen-layout')
    expect(view).toBeTruthy()
    expect(view.props.style).toEqual(customStyle)
  })

  it('should use navigation header edges by default', () => {
    const { getByTestId } = render(
      <ScreenLayout testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    const safeArea = getByTestId('safe-area-view')
    expect(safeArea.props.edges).toEqual(['bottom', 'left', 'right'])
  })

  it('should use custom edges for SafeAreaView', () => {
    const { getByTestId } = render(
      <ScreenLayout edges={['top']} testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    const safeArea = getByTestId('safe-area-view')
    expect(safeArea).toBeTruthy()
    expect(safeArea.props.edges).toEqual(['top'])
  })

  it('should pass additional props to View', () => {
    const { getByTestId } = render(
      <ScreenLayout accessibilityLabel="Screen" testID="screen-layout">
        <Text>Content</Text>
      </ScreenLayout>,
    )

    const view = getByTestId('screen-layout')
    expect(view).toBeTruthy()
    expect(view.props.accessibilityLabel).toBe('Screen')
  })
})
