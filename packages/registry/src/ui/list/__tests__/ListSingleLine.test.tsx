import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { ListSingleLine } from '../ListSingleLine'

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

describe('ListSingleLine', () => {
  it('should render with label', () => {
    const { getByText, getByTestId } = render(
      <ListSingleLine label="Test Label" testID="list-single-line" />,
    )

    expect(getByTestId('list-single-line')).toBeTruthy()
    expect(getByText('Test Label')).toBeTruthy()
  })

  it('should render with description', () => {
    const { getByText } = render(
      <ListSingleLine description="Description text" label="Label" testID="list-single-line" />,
    )

    expect(getByText('Description text')).toBeTruthy()
  })

  it('should render without description', () => {
    const { getByText, queryByText } = render(
      <ListSingleLine label="Label" testID="list-single-line" />,
    )

    expect(getByText('Label')).toBeTruthy()
    expect(queryByText('Description text')).toBeNull()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ListSingleLine className="custom-class" label="Label" testID="list-single-line" />,
    )

    expect(getByTestId('list-single-line')).toBeTruthy()
  })
})
