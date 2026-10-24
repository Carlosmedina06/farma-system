import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import { ModalActions } from '../ModalActions/ModalActions'

jest.mock('@farma/registry/ui/button-section-layout', () => ({
  ButtonSectionLayout: jest.fn(({ testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'button-section'} />
  }),
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('ModalActions', () => {
  const mockInsets = { top: 0, bottom: 0, left: 0, right: 0 }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null when no actions are provided', () => {
    const { queryByTestId } = render(<ModalActions insets={mockInsets} />)

    expect(queryByTestId('button-section')).toBeNull()
  })

  it('should render ButtonSectionLayout when primaryAction is provided', () => {
    const { getByTestId } = render(
      <ModalActions
        insets={mockInsets}
        primaryAction={{ onPress: jest.fn(), children: 'OK' }}
      />,
    )

    expect(getByTestId('button-section')).toBeTruthy()
  })

  it('should render ButtonSectionLayout when secondaryAction is provided', () => {
    const { getByTestId } = render(
      <ModalActions
        insets={mockInsets}
        secondaryAction={{ onPress: jest.fn(), children: 'Cancel' }}
      />,
    )

    expect(getByTestId('button-section')).toBeTruthy()
  })

  it('should render ButtonSectionLayout when both actions are provided', () => {
    const { getByTestId } = render(
      <ModalActions
        insets={mockInsets}
        primaryAction={{ onPress: jest.fn(), children: 'OK' }}
        secondaryAction={{ onPress: jest.fn(), children: 'Cancel' }}
      />,
    )

    expect(getByTestId('button-section')).toBeTruthy()
  })
})

