import { Image, View } from 'react-native'

import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import type { ChatAttachment } from '../ChatBubble.types'

export const ATTACHMENT_SIZE = 100

/** Render por defecto: miniatura para imágenes, tile con icono + nombre para pdf/archivo. */
export const AttachmentPreview = ({ attachment }: { attachment: ChatAttachment }) => {
  if (attachment.type === 'image' && attachment.uri) {
    return (
      <Image
        accessibilityLabel={attachment.name}
        source={{ uri: attachment.uri }}
        style={{ width: ATTACHMENT_SIZE, height: ATTACHMENT_SIZE }}
        testID="chat-bubble-attachment-image"
      />
    )
  }

  return (
    <View
      className="gap-gap-xxs p-padding-sm items-center justify-center rounded-sm bg-base-white"
      style={{ width: ATTACHMENT_SIZE, height: ATTACHMENT_SIZE }}
      testID="chat-bubble-attachment-file"
    >
      <Icon
        className="text-gray-500"
        name={attachment.type === 'image' ? 'image-01' : 'file-06'}
        size={32}
      />
      <Text className="text-center text-gray-700" numberOfLines={2} type="caption">
        {attachment.name}
      </Text>
    </View>
  )
}
