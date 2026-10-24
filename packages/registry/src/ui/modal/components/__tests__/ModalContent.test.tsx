import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import { ModalContent } from '../ModalContent/ModalContent'

jest.mock('@farma/registry/ui/featured-icon', () => ({
  FeaturedIcon: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'featured-icon'} />
  }),
}))

jest.mock('@farma/registry/ui/text', () => {
  const mod: any = (() => {
  const React = require('react')
  const { Text } = require('react-native')

  return function MockText({ children, type, className, testID, accessibilityRole }: any) {
    return (
      <Text
        accessibilityRole={accessibilityRole}
        className={className}
        testID={testID || 'text'}
        type={type}
      >
        {children}
      </Text>
    )
  }
})()
  return { ...mod, Text: mod.Text ?? mod.default ?? mod }
})

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ModalContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render with title', () => {
    const { getByText } = render(<ModalContent title="Test Title" />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should expose header role on title', () => {
    const { getByText } = render(<ModalContent title="Test Title" />)

    expect(getByText('Test Title').props.accessibilityRole).toBe('header')
  })

  it('should render with description', () => {
    const { getByText } = render(<ModalContent title="Test Title" description="Test Description" />)

    expect(getByText('Test Description')).toBeTruthy()
  })

  it('should render formattedDescription when provided', () => {
    const formattedDescription = <div>Formatted Description</div>
    const { UNSAFE_root } = render(<ModalContent title="Test Title" formattedDescription={formattedDescription} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render icon when provided', () => {
    const { getByTestId } = render(
      <ModalContent title="Test Title" icon={{ icon: 'check-circle', type: 'success' }} />,
    )

    expect(getByTestId('featured-icon', { includeHiddenElements: true })).toBeTruthy()
  })

  it('should render preContent when provided', () => {
    const preContent = <div>Pre Content</div>
    const { UNSAFE_root } = render(<ModalContent title="Test Title" preContent={preContent} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should not render icon when preContent is provided', () => {
    const preContent = <div>Pre Content</div>
    const { queryByTestId } = render(
      <ModalContent title="Test Title" preContent={preContent} icon={{ icon: 'check-circle', type: 'success' }} />,
    )

    expect(queryByTestId('featured-icon')).toBeNull()
  })
})

