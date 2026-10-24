import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import React from 'react'
import { render } from '@testing-library/react-native'
import Text from '../Text'

jest.mock('@farma/registry/lib/utils', () => ({
  cn: jest.fn((...classes: any[]) => classes.filter(Boolean).join(' ')),
}))

jest.mock('tailwind-variants', () => ({
  tv: jest.fn(() => {
    return jest.fn(({ type, semibold }: any) => {
      const baseClasses = 'text-gray-800 font-normal'
      const typeClasses: Record<string, string> = {
        h1: 'text-[24px] leading-[32px] font-semibold',
        h2: 'text-[20px] leading-[24px] font-semibold',
        h3: 'text-[18px] leading-[24px] font-semibold',
        h4: 'text-[16px] leading-[20px] font-semibold',
        body1: 'text-[16px] leading-[24px]',
        body2: 'text-[14px] leading-[20px]',
        caption: 'text-[12px] leading-[16px]',
      }
      const semiboldClass = semibold ? 'font-semibold' : ''
      return `${baseClasses} ${typeClasses[type || 'body1']} ${semiboldClass}`.trim()
    })
  }),
}))

describe('Text', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children', () => {
    const { getByText } = render(<Text>Test Content</Text>)

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should use body1 as default type', () => {
    const { getByText } = render(<Text>Test Content</Text>)

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should apply h1 type', () => {
    const { getByText } = render(<Text type="h1">Heading 1</Text>)

    expect(getByText('Heading 1')).toBeTruthy()
  })

  it('should apply h2 type', () => {
    const { getByText } = render(<Text type="h2">Heading 2</Text>)

    expect(getByText('Heading 2')).toBeTruthy()
  })

  it('should apply h3 type', () => {
    const { getByText } = render(<Text type="h3">Heading 3</Text>)

    expect(getByText('Heading 3')).toBeTruthy()
  })

  it('should apply h4 type', () => {
    const { getByText } = render(<Text type="h4">Heading 4</Text>)

    expect(getByText('Heading 4')).toBeTruthy()
  })

  it('should apply body1 type', () => {
    const { getByText } = render(<Text type="body1">Body 1</Text>)

    expect(getByText('Body 1')).toBeTruthy()
  })

  it('should apply body2 type', () => {
    const { getByText } = render(<Text type="body2">Body 2</Text>)

    expect(getByText('Body 2')).toBeTruthy()
  })

  it('should apply caption type', () => {
    const { getByText } = render(<Text type="caption">Caption</Text>)

    expect(getByText('Caption')).toBeTruthy()
  })

  it('should apply semibold when provided', () => {
    const { getByText } = render(<Text semibold>Bold Text</Text>)

    expect(getByText('Bold Text')).toBeTruthy()
  })

  it('should not apply semibold to h1, h2, h3, h4, blue types', () => {
    const { getByText } = render(<Text type="h1" semibold>Heading</Text>)

    expect(getByText('Heading')).toBeTruthy()
  })

  it('should apply Inter-SemiBold font for semibold text', () => {
    const { getByText } = render(<Text semibold>Bold Text</Text>)

    const text = getByText('Bold Text')
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontFamily: 'Inter-SemiBold' })]))
  })

  it('should apply Inter-SemiBold font for h1, h2, h3, blue types', () => {
    const { getByText } = render(<Text type="h1">Heading</Text>)

    const text = getByText('Heading')
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontFamily: 'Inter-SemiBold' })]))
  })

  it('should apply Inter-Regular font by default', () => {
    const { getByText } = render(<Text>Regular Text</Text>)

    const text = getByText('Regular Text')
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontFamily: 'Inter-Regular' })]))
  })

  it('should apply Manrope-SemiBold font for mono-lg type', () => {
    const { getByText } = render(<Text type="mono-lg">1234</Text>)

    const text = getByText('1234')
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontFamily: 'Manrope-SemiBold' })]))
  })

  it('should apply Manrope-SemiBold font for mono-sm type', () => {
    const { getByText } = render(<Text type="mono-sm">Card Text</Text>)

    const text = getByText('Card Text')
    expect(text.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ fontFamily: 'Manrope-SemiBold' })]))
  })

  it('should apply custom className', () => {
    const { getByText } = render(<Text className="custom-class">Test</Text>)

    expect(getByText('Test')).toBeTruthy()
  })

  it('should apply custom style', () => {
    const customStyle = { backgroundColor: 'red' }
    const { getByText } = render(<Text style={customStyle}>Test</Text>)

    const text = getByText('Test')
    expect(text.props.style).toEqual(expect.arrayContaining([customStyle]))
  })

  it('should pass numberOfLines prop', () => {
    const { getByText } = render(<Text numberOfLines={2}>Long text that should be truncated</Text>)

    const text = getByText('Long text that should be truncated')
    expect(text.props.numberOfLines).toBe(2)
  })

  it('should pass additional props', () => {
    const { getByText } = render(<Text testID="custom-text">Test</Text>)

    expect(getByText('Test').props.testID).toBe('custom-text')
  })

  it('should disable font scaling by default', () => {
    const { getByText } = render(<Text>Scaled text</Text>)

    const text = getByText('Scaled text')

    expect(text.props.allowFontScaling).toBe(false)
    expect(text.props.maxFontSizeMultiplier).toBe(1)
  })

  it('should handle blue type', () => {
    const { getByText } = render(<Text type="blue">Blue Text</Text>)

    expect(getByText('Blue Text')).toBeTruthy()
  })

  it('should handle gray type', () => {
    const { getByText } = render(<Text type="gray">Gray Text</Text>)

    expect(getByText('Gray Text')).toBeTruthy()
  })

  it('should handle semiGray type', () => {
    const { getByText } = render(<Text type="semiGray">Semi Gray Text</Text>)

    expect(getByText('Semi Gray Text')).toBeTruthy()
  })

  it('should handle price type', () => {
    const { getByText } = render(<Text type="price">$100</Text>)

    expect(getByText('$100')).toBeTruthy()
  })

  it('should handle navbar type', () => {
    const { getByText } = render(<Text type="navbar">Nav</Text>)

    expect(getByText('Nav')).toBeTruthy()
  })
})

