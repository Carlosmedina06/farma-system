import { describe, expect, it, jest, test } from '@jest/globals'
import { render, fireEvent, act } from '@testing-library/react-native'
import { Text } from 'react-native'

import { Accordion } from '../Accordion'

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react')
  const { View } = require('react-native')

  const AnimatedView = React.forwardRef((props: any, ref: any) => <View ref={ref} {...props} />)

  AnimatedView.displayName = 'Animated.View'

  const mockSharedValue = { value: 0 }
  const mockDerivedValue = { value: 0 }

  return {
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
    useSharedValue: jest.fn(() => mockSharedValue),
    useAnimatedStyle: jest.fn(() => ({ height: 0 })),
    useDerivedValue: jest.fn(() => mockDerivedValue),
    withTiming: jest.fn((value: any) => ({ value })),
    runOnJS: jest.fn((fn: any) => fn), // Don't execute, just return the function
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function MockIcon({ name, testID, ...props }: any) {
    return <View testID={`icon-${name}`} {...props} />
  }
})()
  return { Icon: mod?.default ?? mod }
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

describe('Accordion', () => {
  it('should render with title', () => {
    const { getByText, getByTestId } = render(
      <Accordion title="Test Accordion" viewKey="test">
        <Text>Content</Text>
      </Accordion>,
    )

    expect(getByText('Test Accordion')).toBeTruthy()
    expect(getByTestId('accordion-header')).toBeTruthy()
  })

  it('should render with children', () => {
    const { getByText } = render(
      <Accordion title="Test" viewKey="test">
        <Text>Accordion Content</Text>
      </Accordion>,
    )

    expect(getByText('Accordion Content')).toBeTruthy()
  })

  it('should call onOpenChange when header is pressed', () => {
    const onOpenChange = jest.fn()

    const { getByTestId } = render(
      <Accordion title="Test" viewKey="test" onOpenChange={onOpenChange}>
        <Text>Content</Text>
      </Accordion>,
    )

    act(() => {
      fireEvent.press(getByTestId('accordion-header'))
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('should render with different viewKeys', () => {
    const { getByText, rerender } = render(
      <Accordion title="Test" viewKey="key1">
        <Text>Content</Text>
      </Accordion>,
    )

    expect(getByText('Test')).toBeTruthy()

    rerender(
      <Accordion title="Test" viewKey="key2">
        <Text>Content</Text>
      </Accordion>,
    )

    expect(getByText('Test')).toBeTruthy()
  })
})
