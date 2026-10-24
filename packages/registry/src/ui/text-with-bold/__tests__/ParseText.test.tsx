import { describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { ParseText } from '../ParseText/ParseText'

jest.mock('@farma/registry/ui/text', () => {
  const { Text } = require('react-native')

  return {
    Text: ({ children, semibold, className, testID }: any) => (
      <Text
        className={className}
        style={{ fontWeight: semibold ? '600' : '400' }}
        testID={testID || `text-${semibold ? 'bold' : 'regular'}`}
      >
        {children}
      </Text>
    ),
  }
})

describe('ParseText', () => {
  it('should render bold text when text has bold markers', () => {
    const { getByText } = render(<ParseText position={0} text="**Hello**" textType="body1" />)
    const text = getByText('Hello ')

    expect(text.props.style.fontWeight).toBe('600')
  })

  it('should render bold text with semibold when position is greater than 0', () => {
    const { getByText } = render(<ParseText position={1} text="**Hello**" textType="body1" />)

    expect(getByText('Hello ').props.style.fontWeight).toBe('600')
  })

  it('should split regular text by spaces', () => {
    const { getByText } = render(<ParseText position={0} text="Hello World Test" textType="body1" />)

    expect(getByText('Hello ')).toBeTruthy()
    expect(getByText('World ')).toBeTruthy()
    expect(getByText('Test ')).toBeTruthy()
  })

  it('should render regular text with normal font weight', () => {
    const { getByText } = render(<ParseText position={0} text="Hello" textType="body1" />)

    expect(getByText('Hello ').props.style.fontWeight).toBe('400')
  })

  it('should pass textColor as className', () => {
    const { getByText } = render(<ParseText position={0} text="Hello" textColor="text-primary-600" textType="body1" />)

    expect(getByText('Hello ').props.className).toBe('text-primary-600')
  })

  it('should render nothing for empty or missing text', () => {
    expect(render(<ParseText position={0} text="" textType="body1" />).toJSON()).toBeNull()
    expect(render(<ParseText position={0} text={undefined as any} textType="body1" />).toJSON()).toBeNull()
  })

  it('should remove bold markers and support multiple words, accents and punctuation', () => {
    const { getByText, queryByText, rerender } = render(<ParseText position={0} text="**Hello World**" textType="body1" />)

    expect(getByText('Hello World ')).toBeTruthy()
    expect(queryByText('**Hello World**')).toBeNull()

    rerender(<ParseText position={0} text="**José**" textType="body1" />)
    expect(getByText('José ')).toBeTruthy()

    rerender(<ParseText position={0} text="**Test, 123**" textType="body1" />)
    expect(getByText('Test, 123 ')).toBeTruthy()
  })
})
