import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { ListIcon } from '../ListIcon'

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

describe('ListIcon', () => {
  it('should render with label and icon', () => {
    const { getByText, getByTestId } = render(
      <ListIcon icon="check" label="Test Label" testID="list-icon" />,
    )

    expect(getByTestId('list-icon')).toBeTruthy()
    expect(getByText('Test Label')).toBeTruthy()
    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render with description', () => {
    const { getByText } = render(
      <ListIcon description="Description text" icon="check" label="Label" testID="list-icon" />,
    )

    expect(getByText('Description text')).toBeTruthy()
  })

  it('should render without description', () => {
    const { getByText, queryByText } = render(
      <ListIcon icon="check" label="Label" testID="list-icon" />,
    )

    expect(getByText('Label')).toBeTruthy()
    expect(queryByText('Description text')).toBeNull()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ListIcon className="custom-class" icon="check" label="Label" testID="list-icon" />,
    )

    expect(getByTestId('list-icon')).toBeTruthy()
  })
})
