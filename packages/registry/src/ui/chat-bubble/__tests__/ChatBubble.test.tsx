import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render } from '@testing-library/react-native'
import { Text } from 'react-native'

import { ChatBubble } from '../ChatBubble'
import type { ChatAttachment } from '../ChatBubble.types'

const image: ChatAttachment = { name: 'foto.jpg', type: 'image', uri: 'https://example.com/foto.jpg' }
const pdf: ChatAttachment = { name: 'documento.pdf', type: 'pdf', uri: 'file://documento.pdf' }

describe('ChatBubble · incoming', () => {
  it('should render message and time', () => {
    const { getByText } = render(<ChatBubble direction="incoming" text="Test message" time="10:00" />)

    expect(getByText('Test message')).toBeTruthy()
    expect(getByText('10:00')).toBeTruthy()
  })

  it('should render unread icon when not read', () => {
    const { getByTestId, queryByTestId } = render(<ChatBubble direction="incoming" text="Hola" time="10:00" />)

    expect(getByTestId('message-unread-icon')).toBeTruthy()
    expect(queryByTestId('message-read-icon')).toBeNull()
  })

  it('should render read icon when read', () => {
    const { getByTestId } = render(<ChatBubble read direction="incoming" text="Hola" time="10:00" />)

    expect(getByTestId('message-read-icon')).toBeTruthy()
  })

  it('should hide read status when showReadStatus is false', () => {
    const { queryByTestId } = render(
      <ChatBubble direction="incoming" showReadStatus={false} text="Hola" time="10:00" />,
    )

    expect(queryByTestId('message-read-icon')).toBeNull()
    expect(queryByTestId('message-unread-icon')).toBeNull()
  })

  it('should call onPress with the text when the bubble is pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <ChatBubble direction="incoming" testID="msg" text="Test message" time="10:00" onPress={onPress} />,
    )

    fireEvent.press(getByTestId('msg-content'))

    expect(onPress).toHaveBeenCalledWith('Test message')
  })

  it('should apply link styling when isLink is true', () => {
    const { getByText } = render(<ChatBubble isLink direction="incoming" text="https://x.com" time="10:00" />)

    expect(getByText('https://x.com').props.className).toContain('text-blue-600')
  })

  it('should render loading skeleton instead of the attachment while loading', () => {
    const { getByTestId, queryByTestId } = render(
      <ChatBubble loading attachment={image} direction="incoming" time="10:00" />,
    )

    expect(getByTestId('chat-bubble-loading')).toBeTruthy()
    expect(queryByTestId('chat-bubble-attachment')).toBeNull()
  })

  it('should render image attachment thumbnail', () => {
    const { getByTestId } = render(<ChatBubble attachment={image} direction="incoming" time="10:00" />)

    expect(getByTestId('chat-bubble-attachment-image').props.source).toEqual({ uri: image.uri })
  })

  it('should render a file tile for pdf attachments', () => {
    const { getByTestId, getByText } = render(<ChatBubble attachment={pdf} direction="incoming" time="10:00" />)

    expect(getByTestId('chat-bubble-attachment-file')).toBeTruthy()
    expect(getByText('documento.pdf')).toBeTruthy()
  })

  it('should call onPressAttachment with the attachment', () => {
    const onPressAttachment = jest.fn()
    const { getByTestId } = render(
      <ChatBubble
        attachment={image}
        direction="incoming"
        time="10:00"
        onPressAttachment={onPressAttachment}
      />,
    )

    fireEvent.press(getByTestId('chat-bubble-attachment'))

    expect(onPressAttachment).toHaveBeenCalledWith(image)
  })

  it('should use renderAttachment slot when provided', () => {
    const renderAttachment = jest.fn((a: ChatAttachment) => <Text>{`custom ${a.name}`}</Text>)
    const { getByText, queryByTestId } = render(
      <ChatBubble attachment={pdf} direction="incoming" renderAttachment={renderAttachment} time="10:00" />,
    )

    expect(getByText('custom documento.pdf')).toBeTruthy()
    expect(renderAttachment).toHaveBeenCalledWith(pdf)
    expect(queryByTestId('chat-bubble-attachment-file')).toBeNull()
  })

  it('should render text and attachment together', () => {
    const { getByText, getByTestId } = render(
      <ChatBubble attachment={image} direction="incoming" text="Mirá" time="10:00" />,
    )

    expect(getByText('Mirá')).toBeTruthy()
    expect(getByTestId('chat-bubble-attachment')).toBeTruthy()
  })

  it('should pass testID', () => {
    const { getByTestId } = render(<ChatBubble direction="incoming" testID="incoming-message" text="Hola" time="10:00" />)

    expect(getByTestId('incoming-message')).toBeTruthy()
  })
})

describe('ChatBubble · outgoing', () => {
  it('should render senderName and message', () => {
    const { getByText } = render(<ChatBubble direction="outgoing" senderName="Operador" text="Test message" />)

    expect(getByText('Operador')).toBeTruthy()
    expect(getByText('Test message')).toBeTruthy()
  })

  it('should not render a sender name by default', () => {
    const { queryByText } = render(<ChatBubble direction="outgoing" text="Test" />)

    expect(queryByText('Operador')).toBeNull()
  })

  it('should render time when provided and not otherwise', () => {
    const { getByText, rerender, queryByText } = render(
      <ChatBubble direction="outgoing" text="Test" time="10:30 AM" />,
    )

    expect(getByText('10:30 AM')).toBeTruthy()

    rerender(<ChatBubble direction="outgoing" text="Test" />)

    expect(queryByText('10:30 AM')).toBeNull()
  })

  it('should not render read status', () => {
    const { queryByTestId } = render(<ChatBubble read direction="outgoing" text="Test" />)

    expect(queryByTestId('message-read-icon')).toBeNull()
    expect(queryByTestId('message-unread-icon')).toBeNull()
  })

  it('should render the typing indicator instead of the message when typing', () => {
    const { getByTestId, getByText, queryByText } = render(
      <ChatBubble typing direction="outgoing" senderName="Operador" text="Test message" />,
    )

    expect(getByTestId('chat-bubble-typing')).toBeTruthy()
    expect(getByText('Escribiendo...')).toBeTruthy()
    expect(getByText('Operador')).toBeTruthy()
    expect(queryByText('Test message')).toBeNull()
  })

  it('should forward typingLabel to the indicator', () => {
    const { getByText } = render(<ChatBubble typing direction="outgoing" typingLabel="Typing..." />)

    expect(getByText('Typing...')).toBeTruthy()
  })

  it('should call onPress when message is pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <ChatBubble direction="outgoing" testID="out" text="Test message" onPress={onPress} />,
    )

    fireEvent.press(getByTestId('out-content'))

    expect(onPress).toHaveBeenCalledWith('Test message')
  })

  it('should not throw when pressed without onPress', () => {
    const { getByTestId } = render(<ChatBubble direction="outgoing" testID="out" text="Test message" />)

    expect(() => fireEvent.press(getByTestId('out-content'))).not.toThrow()
  })

  it('should hide the text when there is an attachment', () => {
    const { queryByText, getByTestId } = render(
      <ChatBubble attachment={image} direction="outgoing" text="caption" />,
    )

    expect(queryByText('caption')).toBeNull()
    expect(getByTestId('chat-bubble-attachment-image')).toBeTruthy()
  })

  it('should call onPressAttachment when the attachment is pressed', () => {
    const onPressAttachment = jest.fn()
    const { getByTestId } = render(
      <ChatBubble attachment={pdf} direction="outgoing" testID="out" onPressAttachment={onPressAttachment} />,
    )

    fireEvent.press(getByTestId('out-attachment'))

    expect(onPressAttachment).toHaveBeenCalledWith(pdf)
  })

  it('should apply custom className, style and extra props', () => {
    const { getByTestId } = render(
      <ChatBubble
        accessibilityLabel="Outcoming message"
        className="custom-class"
        direction="outgoing"
        style={{ marginTop: 10 }}
        testID="outcoming-message"
        text="Test"
      />,
    )

    const view = getByTestId('outcoming-message')

    expect(view.props.className).toContain('custom-class')
    expect(view).toHaveStyle({ marginTop: 10 })
    expect(view.props.accessibilityLabel).toBe('Outcoming message')
  })
})

describe('ChatBubble · LoadingImageSkeleton', () => {
  it('should render a 100x100 shimmer', () => {
    const { getByTestId } = render(<ChatBubble loading direction="incoming" time="10:00" />)

    const skeleton = getByTestId('chat-bubble-loading')
    const shimmer = skeleton.findAll((node) => node.props.width === 100 && node.props.height === 100)

    expect(shimmer.length).toBeGreaterThan(0)
  })
})
