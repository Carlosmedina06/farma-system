import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { Badge } from '../Badge'

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

describe('Badge', () => {
  it('should render with required props', () => {
    const { getByText, getByTestId } = render(
      <Badge color="primary" size="md" testID="badge">
        Test Badge
      </Badge>,
    )

    expect(getByTestId('badge')).toBeTruthy()
    expect(getByText('Test Badge')).toBeTruthy()
  })

  it('should render with icon on left side', () => {
    const { getByTestId } = render(
      <Badge color="primary" icon="check" size="md" testID="badge">
        Badge
      </Badge>,
    )

    expect(getByTestId('badge')).toBeTruthy()
    expect(getByTestId('badge-left-icon')).toBeTruthy()
  })

  it('should render with icon on right side', () => {
    const { getByTestId } = render(
      <Badge iconRightSide color="primary" icon="check" size="md" testID="badge">
        Badge
      </Badge>,
    )

    expect(getByTestId('badge')).toBeTruthy()
    expect(getByTestId('badge-right-icon')).toBeTruthy()
  })

  it('should render with different colors', () => {
    const colors = ['primary', 'error', 'success', 'warning', 'gray'] as const

    colors.forEach((color) => {
      const { getByTestId, unmount } = render(
        <Badge color={color} size="md" testID="badge">
          Badge
        </Badge>,
      )

      expect(getByTestId('badge')).toBeTruthy()
      unmount()
    })
  })

  it('should render with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'wide'] as const

    sizes.forEach((size) => {
      const { getByTestId, unmount } = render(
        <Badge color="primary" size={size} testID="badge">
          Badge
        </Badge>,
      )

      expect(getByTestId('badge')).toBeTruthy()
      unmount()
    })
  })

  it('should render with small radius variant', () => {
    const { getByTestId } = render(
      <Badge color="gray" radius="s" size="xs" testID="badge">
        Badge
      </Badge>,
    )

    expect(getByTestId('badge')).toBeTruthy()
  })

  it('should use caption textType when provided', () => {
    const { getByText } = render(
      <Badge color="tertiary" radius="s" size="xs" textType="caption">
        Más cercana
      </Badge>,
    )

    expect(getByText('Más cercana').props.type).toBe('caption')
    expect(getByText('Más cercana').props.semibold).toBe(false)
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <Badge className="custom-class" color="primary" size="md" testID="badge">
        Badge
      </Badge>,
    )

    expect(getByTestId('badge')).toBeTruthy()
  })

  it('should render semibold text when semibold is true', () => {
    const { getByText } = render(
      <Badge semibold color="primary" size="md" testID="badge">
        Activa
      </Badge>,
    )

    expect(getByText('Activa').props.semibold).toBe(true)
  })

  it('should apply custom iconSize when provided', () => {
    const { getByTestId } = render(
      <Badge
        iconRightSide
        className="text-warning-800"
        color="warning"
        icon="alert-circle"
        iconClassName="text-warning-600"
        iconSize={16}
        size="xs"
        testID="badge"
      >
        Acción requerida
      </Badge>,
    )

    expect(getByTestId('badge-right-icon')).toBeTruthy()
    expect(getByTestId('icon-alert-circle').props.size).toBe(16)
    expect(getByTestId('icon-alert-circle').props.className).toBe('text-warning-600')
  })
})
