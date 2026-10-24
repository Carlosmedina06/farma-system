import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import GradientCard from '../GradientCard'

const getInnerStyle = () =>
  screen.UNSAFE_root.findAll((node) => typeof node.type === 'string' && node.props.nativeID === 'inner')[0]!.props.style

const mockLinearGradient = jest.fn(({ children, testID }: any) => {
  const { View } = require('react-native')

  return <View testID={testID || 'linear-gradient'}>{children}</View>
})

jest.mock('@farma/registry/ui/linear-gradient', () => ({
  UniwindLinearGradient: (props: any) => mockLinearGradient(props),
}))

jest.mock('@farma/registry/ui/animated-layout', () => {
  const { View } = require('react-native')

  return {
    AnimatedLayout: ({ children, testID }: any) => <View testID={testID || 'animated-layout'}>{children}</View>,
  }
})

describe('GradientCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children', () => {
    render(
      <GradientCard>
        <Text>Test Content</Text>
      </GradientCard>,
    )

    expect(screen.getByText('Test Content')).toBeTruthy()
  })

  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    render(
      <GradientCard testID="gradient-card" onPress={onPress}>
        <Text>Test Content</Text>
      </GradientCard>,
    )

    fireEvent.press(screen.getByTestId('gradient-card'))
    expect(onPress).toHaveBeenCalled()
  })

  it('should use default gradient colors when not provided', () => {
    render(
      <GradientCard>
        <Text>Test Content</Text>
      </GradientCard>,
    )

    expect(screen.getByTestId('linear-gradient')).toBeTruthy()
    expect((mockLinearGradient.mock.calls[0]![0] as any).colors).toEqual(['#FFFFFF', '#98DAF1', '#98DAF1'])
  })

  it('should use custom gradient colors when provided', () => {
    const gradientColors = ['#FF0000', '#00FF00', '#0000FF'] as const
    render(
      <GradientCard gradientColors={gradientColors}>
        <Text>Test Content</Text>
      </GradientCard>,
    )

    expect((mockLinearGradient.mock.calls[0]![0] as any).colors).toEqual(gradientColors)
  })

  it('should apply width, minHeight and custom style to the inner view', () => {
    render(
      <GradientCard minHeight={100} nativeID="inner" style={{ backgroundColor: 'red' }} testID="gradient-card" width={200}>
        <Text>Test Content</Text>
      </GradientCard>,
    )

    expect(getInnerStyle()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ minHeight: 100, width: 200 }),
        expect.objectContaining({ backgroundColor: 'red' }),
      ]),
    )
  })

  it('should use 100% width when width is not provided', () => {
    render(
      <GradientCard nativeID="inner">
        <Text>Test Content</Text>
      </GradientCard>,
    )

    expect(getInnerStyle()).toEqual(expect.arrayContaining([expect.objectContaining({ width: '100%' })]))
  })
})
