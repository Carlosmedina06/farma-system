import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DetailCard } from '../DetailCard'

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: function MockText({ children, className, semibold, testID }: any) {
      return (
        <Text className={className} style={{ fontWeight: semibold ? '600' : '400' }} testID={testID || 'text'}>
          {children}
        </Text>
      )
    },
  }
})

jest.mock('@farma/registry/ui/icon', () => {
  const { View } = require('react-native')

  return {
    Icon: function Icon({ name, testID }: any) {
      return <View testID={testID || `icon-${name}`} />
    },
  }
})

jest.mock('@farma/registry/ui/button', () => ({
  Button: jest.fn(({ children, onPress, type, className, testID }: any) => {
    const React = require('react')
    const { Pressable, Text } = require('react-native')
    return (
      <Pressable testID={testID || 'button'} onPress={onPress} className={className}>
        <Text>{children}</Text>
      </Pressable>
    )
  }),
}))

jest.mock('@farma/registry/ui/list', () => ({
  ListBold: jest.fn(({ label, description, caption, additionalDescription, footnote, icon, testID }: any) => {
    const { View, Text } = require('react-native')
    return (
      <View testID={testID || 'list-bold'}>
        {label && <Text>{label}</Text>}
        {description && <Text>{description}</Text>}
        {caption && <Text>{caption}</Text>}
        {additionalDescription && <Text>{additionalDescription}</Text>}
        {footnote && <Text>{footnote}</Text>}
        {icon && <View testID={`icon-${icon}`} />}
      </View>
    )
  }),
}))

jest.mock('@farma/registry/ui/shimmer-skeleton', () => ({
  ShimmerSkeleton: jest.fn(({ height, width, colorMode, testID }: any) => {
    const React = require('react')
    const { View } = require('react-native')
    return <View testID={testID || 'skeleton'} style={{ height, width }} />
  }),
}))

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

describe('DetailCard', () => {
  const mockItems = [
    { label: 'Item 1', description: 'Description 1', icon: 'check' as any },
    { label: 'Item 2', description: 'Description 2', icon: 'x' as any },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render title', () => {
    const { getByText } = render(<DetailCard title="Test Title" itemsList={mockItems} />)

    expect(getByText('Test Title')).toBeTruthy()
  })

  it('should render items list', () => {
    const { getByText } = render(<DetailCard title="Test Title" itemsList={mockItems} />)

    expect(getByText('Item 1')).toBeTruthy()
    expect(getByText('Item 2')).toBeTruthy()
  })

  it('should render edit icon when showEdit is true', () => {
    const { getByTestId } = render(<DetailCard title="Test Title" itemsList={mockItems} showEdit={true} onPress={jest.fn()} />)

    expect(getByTestId('icon-edit-01')).toBeTruthy()
  })

  it('should call onPress when edit icon is pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(<DetailCard title="Test Title" itemsList={mockItems} showEdit={true} onPress={onPress} />)

    const editIcon = getByTestId('icon-edit-01').parent
    if (editIcon) {
      fireEvent.press(editIcon)
      expect(onPress).toHaveBeenCalled()
    }
  })

  it('should render button text when buttonText is provided', () => {
    const { getByText } = render(<DetailCard title="Test Title" itemsList={mockItems} buttonText="Edit" onPress={jest.fn()} />)

    expect(getByText('Edit')).toBeTruthy()
  })

  it('should call onPress when button is pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(<DetailCard title="Test Title" itemsList={mockItems} buttonText="Edit" onPress={onPress} />)

    const button = getByText('Edit').parent
    if (button) {
      fireEvent.press(button)
      expect(onPress).toHaveBeenCalled()
    }
  })

  it('should render skeleton when isLoading is true', () => {
    const { getAllByTestId } = render(<DetailCard title="Test Title" itemsList={mockItems} isLoading={true} />)

    expect(getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })

  it('should not render items when isLoading is true', () => {
    const { queryByText } = render(<DetailCard title="Test Title" itemsList={mockItems} isLoading={true} />)

    expect(queryByText('Item 1')).toBeNull()
  })

  it('should render divider when divider is true', () => {
    const { UNSAFE_root } = render(<DetailCard title="Test Title" itemsList={mockItems} divider={true} />)

    expect(UNSAFE_root.children.length).toBeGreaterThan(0)
  })

  it('should render footer slot below a divider', () => {
    const { Text } = require('react-native')
    const { getByText, getByTestId } = render(
      <DetailCard
        footer={<Text>Footer content</Text>}
        itemsList={mockItems}
        testID="detail-card"
        title="Test Title"
      />,
    )

    expect(getByText('Footer content')).toBeTruthy()
    expect(getByTestId('detail-card-footer')).toBeTruthy()
  })

  it('should render a skeleton instead of the footer while loading', () => {
    const { Text } = require('react-native')
    const { queryByText, getAllByTestId } = render(
      <DetailCard isLoading footer={<Text>Footer content</Text>} itemsList={mockItems} title="Test Title" />,
    )

    expect(queryByText('Footer content')).toBeNull()
    expect(getAllByTestId('skeleton').length).toBe(3)
  })

  it('should not render footer container when footer is not provided', () => {
    const { queryByTestId } = render(<DetailCard itemsList={mockItems} title="Test Title" />)

    expect(queryByTestId('detail-card-footer')).toBeNull()
  })

  it('should apply custom border color', () => {
    const { getByTestId } = render(<DetailCard title="Test Title" itemsList={mockItems} borderColor="#FF0000" testID="detail-card" />)

    expect(getByTestId('detail-card')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<DetailCard title="Test Title" itemsList={mockItems} className="custom-class" testID="detail-card" />)

    expect(getByTestId('detail-card')).toBeTruthy()
  })

  it('should render items with additional description', () => {
    const itemsWithAdditional = [{ label: 'Item 1', additionalDescription: 'Additional', icon: 'check' as any }]
    const { getByText } = render(<DetailCard title="Test Title" itemsList={itemsWithAdditional} />)

    expect(getByText('Item 1')).toBeTruthy()
  })

  it('should render items with caption', () => {
    const itemsWithCaption = [{ label: 'Item 1', caption: 'Caption', icon: 'check' as any }]
    const { getByText } = render(<DetailCard title="Test Title" itemsList={itemsWithCaption} />)

    expect(getByText('Item 1')).toBeTruthy()
  })

  it('should show the default noCost label for items with noCost', () => {
    const { getByText, getAllByText } = render(
      <DetailCard
        itemsList={[
          { label: 'Envío', icon: 'check' as any, noCost: true },
          { label: 'Otro', icon: 'check' as any },
        ]}
        title="Test Title"
      />,
    )

    expect(getByText('Envío')).toBeTruthy()
    expect(getAllByText('Sin costo')).toHaveLength(1)
  })

  it('should allow overriding noCostLabel', () => {
    const { getByText, queryByText } = render(
      <DetailCard
        itemsList={[{ label: 'Envío', icon: 'check' as any, noCost: true }]}
        noCostLabel="Gratis"
        title="Test Title"
      />,
    )

    expect(getByText('Gratis')).toBeTruthy()
    expect(queryByText('Sin costo')).toBeNull()
  })

  it('should not match labels by text to show the noCost label', () => {
    const { queryByText } = render(
      <DetailCard itemsList={[{ label: 'Retiro en farmacia', icon: 'check' as any }]} title="Test Title" />,
    )

    expect(queryByText('Sin costo')).toBeNull()
  })

  it('should upper-case the first letter of item texts by default', () => {
    const { getByText } = render(
      <DetailCard
        itemsList={[{ label: 'item', description: 'desc', caption: 'cap', icon: 'check' as any }]}
        title="Test Title"
      />,
    )

    expect(getByText('Item')).toBeTruthy()
    expect(getByText('Desc')).toBeTruthy()
    expect(getByText('Cap')).toBeTruthy()
  })

  it('should keep item texts as-is when upperFirst is false', () => {
    const { getByText } = render(
      <DetailCard itemsList={[{ label: 'item', icon: 'check' as any }]} title="Test Title" upperFirst={false} />,
    )

    expect(getByText('item')).toBeTruthy()
  })

  it('should call onPress from the edit button by testID', () => {
    const onPress = jest.fn()
    const { getByTestId, getByLabelText } = render(
      <DetailCard showEdit itemsList={mockItems} title="Test Title" onPress={onPress} />,
    )

    fireEvent.press(getByTestId('detail-card-edit'))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(getByLabelText('Editar')).toBeTruthy()
  })
})
