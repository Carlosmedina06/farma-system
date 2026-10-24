import { describe, expect, it, jest, test } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { ListBold } from '../ListBold'

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

jest.mock('@farma/registry/ui/button', () => ({
  Button: ({ children, ...props }: any) => {
    const React = require('react')
    const { View } = require('react-native')

    return (
      <View testID="button" {...props}>
        {children}
      </View>
    )
  },
}))

describe('ListBold', () => {
  it('should render with label', () => {
    const { getByText, getByTestId } = render(
      <ListBold icon="check" label="Test Label" testID="list-bold" />,
    )

    expect(getByTestId('list-bold')).toBeTruthy()
    expect(getByText('Test Label')).toBeTruthy()
  })

  it('should render with description', () => {
    const { getByText } = render(
      <ListBold description="Description text" icon="check" label="Label" testID="list-bold" />,
    )

    expect(getByText('Description text')).toBeTruthy()
  })

  it('should render with additional description', () => {
    const { getByText } = render(
      <ListBold
        additionalDescription="Additional description"
        icon="check"
        label="Label"
        testID="list-bold"
      />,
    )

    expect(getByText('Additional description')).toBeTruthy()
  })

  it('should render with icon', () => {
    const { getByTestId } = render(<ListBold icon="check" label="Label" testID="list-bold" />)

    expect(getByTestId('icon-check')).toBeTruthy()
  })

  it('should render with right icon', () => {
    const { getByTestId } = render(
      <ListBold icon="check" label="Label" rightIcon="chevron-right" testID="list-bold" />,
    )

    expect(getByTestId('icon-chevron-right')).toBeTruthy()
  })

  it('should render with caption', () => {
    const { getByText } = render(
      <ListBold caption="Caption text" icon="check" label="Label" testID="list-bold" />,
    )

    expect(getByText('Caption text')).toBeTruthy()
  })

  it('should render with function caption', () => {
    const { getByText } = render(
      <ListBold caption={() => 'Function caption'} icon="check" label="Label" testID="list-bold" />,
    )

    expect(getByText('Function caption')).toBeTruthy()
  })

  it('should render with textLinkLabel', () => {
    const { getByTestId } = render(
      <ListBold icon="check" label="Label" testID="list-bold" textLinkLabel="Link" />,
    )

    expect(getByTestId('list-bold-link')).toBeTruthy()
  })

  it('should render disabled styling with subtitle', () => {
    const { getByText, getByTestId } = render(
      <ListBold disabled icon="check" label="Label" subtitle="No disponible" testID="list-bold" />,
    )

    expect(getByText('Label').props.className).toBe('text-gray-400')
    expect(getByText('No disponible').props.className).toBe('text-gray-400')
    expect(getByTestId('icon-check').props.color).toBe('#98a2b3')
  })

  it('should render subtitle without disabled styling', () => {
    const { getByText } = render(
      <ListBold icon="check" label="Label" subtitle="Estado" testID="list-bold" />,
    )

    expect(getByText('Label').props.className).toBe('text-gray-800')
    expect(getByText('Estado').props.className).toBe('text-gray-700')
  })

  it('should not render any business copy by default', () => {
    const { queryByText } = render(<ListBold disabled icon="check" label="Label" />)

    expect(queryByText('Eliminado')).toBeNull()
    expect(queryByText('Sin costo')).toBeNull()
  })

  it('should limit description lines with descriptionNumberOfLines', () => {
    const { getByText } = render(
      <ListBold
        description="Desc"
        descriptionClassName="w-[80%]"
        descriptionNumberOfLines={1}
        icon="check"
        label="Label"
      />,
    )

    expect(getByText('Desc').props.numberOfLines).toBe(1)
    expect(getByText('Desc').props.className).toContain('w-[80%]')
  })

  it('should call onTextLinkPress', () => {
    const onTextLinkPress = jest.fn()
    const { getByTestId } = render(
      <ListBold icon="check" label="Label" textLinkLabel="Link" onTextLinkPress={onTextLinkPress} />,
    )

    expect(getByTestId('list-bold-link').props.onPress).toBe(onTextLinkPress)
  })

  it('should render with capitalize', () => {
    const { getByText } = render(
      <ListBold capitalize icon="check" label="test label" testID="list-bold" />,
    )

    expect(getByText('test label')).toBeTruthy()
  })

  it('should render footnote', () => {
    const { getByText } = render(
      <ListBold footnote="Gratis" icon="check" label="Label" testID="list-bold" />,
    )

    expect(getByText('Gratis')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(
      <ListBold className="custom-class" icon="check" label="Label" testID="list-bold" />,
    )

    expect(getByTestId('list-bold')).toBeTruthy()
  })
})
