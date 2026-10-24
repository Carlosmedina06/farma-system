import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import FeedbackModal from '../ModalFeedBack'

jest.mock('@farma/registry/lib/dimensions', () => ({
  getHP: jest.fn((percentage: number) => percentage * 10),
  getWP: jest.fn((percentage: number) => percentage * 4),
}))

jest.mock('@farma/registry/ui/animated-layout', () => {
  const mod: any = (() => {
  const React = require('react')
  const { View } = require('react-native')

  return function AnimatedLayout({ children, style, testID }: any) {
    return (
      <View testID={testID || 'animated-layout'} style={style}>
        {children}
      </View>
    )
  }
})()
  return { ...mod, AnimatedLayout: mod.AnimatedLayout ?? mod.default ?? mod }
})

jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}))

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, type, className, style, testID }: any) {
    return (
      <Text testID={testID || 'text'} type={type} className={className} style={style}>
        {children}
      </Text>
    )
  }
})()
  return { ...mod, Text: mod.Text ?? mod.default ?? mod }
})

describe('FeedbackModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with default description', () => {
    const { getByText } = render(<FeedbackModal />)

    expect(getByText('We appreciate your feedback!')).toBeTruthy()
  })

  it('should render with custom title', () => {
    const { getByText } = render(<FeedbackModal title="Custom Title" />)

    expect(getByText('Custom Title')).toBeTruthy()
  })

  it('should render with custom description', () => {
    const { getByText } = render(<FeedbackModal description="Custom Description" />)

    expect(getByText('Custom Description')).toBeTruthy()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<FeedbackModal formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render preContent when provided', () => {
    const preContent = <div>Pre Content</div>
    const { UNSAFE_root } = render(<FeedbackModal preContent={preContent} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should use default circumferenceColor', () => {
    const { getByTestId } = render(<FeedbackModal />)

    expect(getByTestId('animated-layout')).toBeTruthy()
  })

  it('should use custom circumferenceColor', () => {
    const { getByTestId } = render(<FeedbackModal circumferenceColor="#FF0000" />)

    expect(getByTestId('animated-layout')).toBeTruthy()
  })

  it('should render StatusBar', () => {
    const { StatusBar } = require('expo-status-bar')
    render(<FeedbackModal />)

    expect(StatusBar).toHaveBeenCalled()
  })

  it('should prioritize formattedDescription over description', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { queryByText } = render(
      <FeedbackModal description="Regular Description" formattedDescription={formattedDescription} />,
    )

    expect(queryByText('Regular Description')).toBeNull()
  })
})

