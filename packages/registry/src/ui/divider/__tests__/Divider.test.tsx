import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { Divider } from '../Divider'
import { DividerType } from '../Divider.types'

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

describe('Divider', () => {
  it('should render line divider by default', () => {
    const { getByTestId } = render(<Divider size="md" testID="divider" />)

    expect(getByTestId('divider')).toBeTruthy()
  })

  it('should render text divider when type is text', () => {
    const { getByTestId, getByText } = render(
      <Divider label="Or" size="md" testID="divider" type={DividerType.Text} />,
    )

    expect(getByTestId('divider')).toBeTruthy()
    expect(getByText('Or')).toBeTruthy()
  })

  it('should render with different sizes', () => {
    const { rerender, getByTestId } = render(<Divider size="xs" testID="divider" />)

    expect(getByTestId('divider')).toBeTruthy()

    rerender(<Divider size="sm" testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()

    rerender(<Divider size="lg" testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()

    rerender(<Divider size="xl" testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()

    rerender(<Divider size="none" testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<Divider className="custom-class" size="md" testID="divider" />)

    expect(getByTestId('divider')).toBeTruthy()
  })

  it('should render text divider with custom color', () => {
    const { getByText } = render(
      <Divider
        color="text-blue-500"
        label="Custom"
        size="md"
        testID="divider"
        type={DividerType.Text}
      />,
    )

    const text = getByText('Custom')

    expect(text).toBeTruthy()
  })
})
