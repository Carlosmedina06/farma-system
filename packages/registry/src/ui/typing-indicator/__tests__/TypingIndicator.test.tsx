import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react-native'

import { TypingIndicator } from '../TypingIndicator'

describe('TypingIndicator', () => {
  it('should render with default props', () => {
    const { getByText, getByTestId } = render(<TypingIndicator />)

    expect(getByText('Escribiendo...')).toBeTruthy()
    expect(getByTestId('lottie-view')).toBeTruthy()
  })

  it('should play the dots animation with the expected size', () => {
    const { getByTestId } = render(<TypingIndicator />)
    const lottie = getByTestId('lottie-view')

    expect(lottie.props.autoPlay).toBe(true)
    expect(lottie.props.source).toBeTruthy()
    expect(lottie.props.style).toEqual({ width: 20, height: 10 })
  })

  it('should allow overriding the label', () => {
    const { getByText, queryByText } = render(<TypingIndicator label="Typing..." />)

    expect(getByText('Typing...')).toBeTruthy()
    expect(queryByText('Escribiendo...')).toBeNull()
  })

  it('should not render a sender header by default', () => {
    const { queryByText } = render(<TypingIndicator />)

    expect(queryByText('Operador')).toBeNull()
  })

  it('should render senderName above the bubble', () => {
    const { getByText, getByTestId } = render(<TypingIndicator senderName="Operador" testID="typing" />)

    expect(getByText('Operador')).toBeTruthy()
    expect(getByTestId('typing')).toBeTruthy()
    expect(getByTestId('typing-bubble')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { getByTestId } = render(<TypingIndicator className="custom-class" testID="typing" />)

    expect(getByTestId('typing').props.className).toContain('custom-class')
  })

  it('should pass testID and additional props to View', () => {
    const { getByTestId } = render(
      <TypingIndicator accessibilityLabel="Writing message" style={{ marginTop: 10 }} testID="writing-message" />,
    )

    const view = getByTestId('writing-message')

    expect(view.props.accessibilityLabel).toBe('Writing message')
    expect(view).toHaveStyle({ marginTop: 10 })
  })
})
