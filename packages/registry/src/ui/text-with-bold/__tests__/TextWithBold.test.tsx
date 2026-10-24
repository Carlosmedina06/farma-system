import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { TextWithBold } from '../TextWithBold'

jest.mock('../ParseText/ParseText', () => {
  const { Text, View } = require('react-native')

  const ParseText = ({ text, position, textColor, textType }: any) => (
    <View testID={`parse-text-${position}`} textColor={textColor} textType={textType}>
      <Text testID={`parse-text-content-${position}`}>{text}</Text>
    </View>
  )

  return { __esModule: true, default: ParseText, ParseText }
})

describe('TextWithBold', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should parse text and render ParseText components', () => {
    const { getByTestId } = render(<TextWithBold testID="text-with-bold" text="Hello World" textType="body1" />)

    expect(getByTestId('parse-text-0')).toBeTruthy()
    expect(getByTestId('parse-text-1')).toBeTruthy()
  })

  it.each([
    ['left', 'flex-start'],
    ['center', 'center'],
    ['right', 'flex-end'],
    [undefined, 'flex-start'],
  ] as const)('should map textAlign %s to justifyContent %s', (textAlign, justifyContent) => {
    const { getByTestId } = render(
      <TextWithBold testID="text-with-bold" text="Hello" textAlign={textAlign} textType="body1" />,
    )

    expect(getByTestId('text-with-bold').props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ justifyContent })]),
    )
  })

  it('should pass textColor and textType to ParseText', () => {
    const { getByTestId } = render(<TextWithBold text="Hello" textColor="text-primary-600" textType="h1" />)

    expect(getByTestId('parse-text-0').props.textColor).toBe('text-primary-600')
    expect(getByTestId('parse-text-0').props.textType).toBe('h1')
  })

  it('should split segments by # when the text has bold markers', () => {
    const { getByTestId } = render(<TextWithBold text="Hola #**mundo**# feliz" textType="body1" />)

    expect(getByTestId('parse-text-content-0').props.children).toBe('Hola ')
    expect(getByTestId('parse-text-content-1').props.children).toBe('**mundo**')
    expect(getByTestId('parse-text-content-2').props.children).toBe(' feliz')
  })

  it('should handle empty text', () => {
    const { getByTestId, queryByTestId } = render(<TextWithBold testID="text-with-bold" text="" textType="body1" />)

    expect(getByTestId('text-with-bold')).toBeTruthy()
    expect(queryByTestId('parse-text-0')).toBeNull()
  })

  it('should apply custom style and pass additional props to View', () => {
    const { getByTestId } = render(
      <TextWithBold accessibilityLabel="Test label" style={{ marginTop: 10 }} testID="text-with-bold" text="Hello" textType="body1" />,
    )
    const view = getByTestId('text-with-bold')

    expect(view.props.style).toEqual(expect.arrayContaining([expect.objectContaining({ marginTop: 10 })]))
    expect(view.props.accessibilityLabel).toBe('Test label')
  })

  it('should update parsed text when text prop changes', () => {
    const { rerender, getByTestId, queryByTestId } = render(<TextWithBold text="Hello" textType="body1" />)

    expect(queryByTestId('parse-text-1')).toBeNull()

    rerender(<TextWithBold text="New Text" textType="body1" />)

    expect(getByTestId('parse-text-1')).toBeTruthy()
  })
})
