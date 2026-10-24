import { Pressable, View } from 'react-native'

import { cn } from '@farma/registry/lib/utils'
import { Text } from '@farma/registry/ui/text'
import { TypingIndicator } from '@farma/registry/ui/typing-indicator'

import type { ChatBubbleProps } from './ChatBubble.types'
import { AttachmentPreview } from './components/AttachmentPreview'
import { LoadingImageSkeleton } from './components/LoadingImageSkeleton'
import { MessageReadIcon, MessageUnreadIcon } from './components/MessageStatusIcons'

export const ChatBubble = ({
  direction,
  text,
  time,
  read = false,
  showReadStatus = true,
  senderName,
  isLink = false,
  attachment,
  loading = false,
  typing = false,
  typingLabel,
  onPress,
  onPressAttachment,
  renderAttachment,
  className,
  testID,
  ...props
}: ChatBubbleProps) => {
  const isIncoming = direction === 'incoming'
  const contentTestID = testID ? `${testID}-content` : 'chat-bubble-content'
  const attachmentTestID = testID ? `${testID}-attachment` : 'chat-bubble-attachment'
  // En `outgoing` el texto se oculta cuando hay adjunto (paridad con OutcomingMessage).
  const showText = Boolean(text) && (isIncoming || !attachment)

  const attachmentNode =
    !loading && attachment ? (
      <Pressable
        accessibilityLabel={attachment.name}
        accessibilityRole={onPressAttachment ? 'button' : undefined}
        disabled={!onPressAttachment}
        testID={attachmentTestID}
        onPress={onPressAttachment ? () => onPressAttachment(attachment) : undefined}
      >
        {renderAttachment ? renderAttachment(attachment) : <AttachmentPreview attachment={attachment} />}
      </Pressable>
    ) : null

  const bubble = (
    <Pressable
      className={cn(
        isIncoming
          ? 'bg-primary-100 flex-1 self-end rounded-tl-md rounded-br-md rounded-bl-md px-3 py-2'
          : 'px-padding-lg py-padding-sm self-start rounded-tr-md rounded-br-md rounded-bl-md bg-gray-100',
      )}
      disabled={!(text && onPress)}
      testID={contentTestID}
      onPress={text && onPress ? () => onPress(text) : undefined}
    >
      {showText && (
        <Text className={isLink ? 'text-blue-600' : 'text-gray-900'} type="body1">
          {text}
        </Text>
      )}
      {loading && <LoadingImageSkeleton />}
      {attachmentNode}
    </Pressable>
  )

  if (isIncoming) {
    return (
      <View {...props} className={cn('gap-1 pl-6', className)} testID={testID}>
        <View className="flex-row items-center justify-end gap-1">
          {!!time && (
            <Text className="text-gray-500" type="caption">
              {time}
            </Text>
          )}
          {showReadStatus && (read ? <MessageReadIcon /> : <MessageUnreadIcon />)}
        </View>
        {bubble}
      </View>
    )
  }

  return (
    <View {...props} className={cn('gap-gap-xxs pr-padding-2xl w-auto', className)} testID={testID}>
      {(!!senderName || !!time) && (
        <View className="gap-gap-xs flex-row items-center justify-between self-start">
          {!!senderName && (
            <Text semibold type="body2">
              {senderName}
            </Text>
          )}
          {!!time && (
            <Text className="text-gray-500" type="caption">
              {time}
            </Text>
          )}
        </View>
      )}
      {typing ? <TypingIndicator label={typingLabel} testID="chat-bubble-typing" /> : bubble}
    </View>
  )
}
