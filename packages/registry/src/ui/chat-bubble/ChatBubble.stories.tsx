import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { ChatBubble } from './ChatBubble'
import type { ChatAttachment } from './ChatBubble.types'

const IMAGE: ChatAttachment = { name: 'foto.jpg', type: 'image', uri: 'https://picsum.photos/200' }
const PDF: ChatAttachment = { name: 'documento.pdf', type: 'pdf', uri: 'https://example.com/documento.pdf' }

const meta = {
  title: 'Moléculas/ChatBubble',
  component: ChatBubble,
  args: {
    direction: 'incoming',
    text: 'Hola, ¿me ayudás con una consulta?',
    time: '10:24',
    read: false,
    isLink: false,
    loading: false,
    typing: false,
    senderName: 'Operador',
  },
  argTypes: { direction: { control: 'inline-radio', options: ['incoming', 'outgoing'] } },
  decorators: [
    (Story) => (
      <View className="w-80">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ChatBubble>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Incoming: Story = { args: { direction: 'incoming', read: true } }

export const Outgoing: Story = { args: { direction: 'outgoing', text: '¡Claro! Contame.' } }

export const Link: Story = { args: { direction: 'incoming', text: 'https://farma.example', isLink: true } }

export const Escribiendo: Story = { args: { direction: 'outgoing', typing: true } }

export const CargandoAdjunto: Story = { args: { direction: 'incoming', text: undefined, loading: true, attachment: IMAGE } }

export const AdjuntoImagen: Story = { args: { direction: 'incoming', text: undefined, attachment: IMAGE } }

export const AdjuntoPdf: Story = { args: { direction: 'outgoing', text: undefined, attachment: PDF } }

export const RenderAttachmentPersonalizado: Story = {
  args: {
    direction: 'outgoing',
    text: undefined,
    attachment: PDF,
    renderAttachment: (attachment) => (
      <View className="h-[100px] w-[100px] items-center justify-center rounded-sm bg-gray-300">
        <Text type="caption">{`Visor: ${attachment.name}`}</Text>
      </View>
    ),
  },
}

function Conversation() {
  const [read, setRead] = useState(false)
  const [typing, setTyping] = useState(true)
  const [log, setLog] = useState<string | null>(null)

  return (
    <View className="gap-4">
      <ChatBubble
        direction="incoming"
        read={read}
        text="Hola, ¿me ayudás con una consulta?"
        time="10:24"
        onPress={(text) => setLog(`onPress · ${text}`)}
      />
      <ChatBubble
        attachment={IMAGE}
        direction="incoming"
        read={read}
        time="10:25"
        onPressAttachment={(a) => setLog(`onPressAttachment · ${a.name}`)}
      />
      <ChatBubble
        direction="outgoing"
        senderName="Operador"
        text="¡Claro! Contame."
        time="10:26"
        typing={typing}
      />
      <View className="flex-row gap-2">
        <Pressable className="rounded-md bg-gray-100 px-3 py-2" onPress={() => setRead((v) => !v)}>
          <Text type="body2">{read ? 'Marcar no leído' : 'Marcar leído'}</Text>
        </Pressable>
        <Pressable className="rounded-md bg-gray-100 px-3 py-2" onPress={() => setTyping((v) => !v)}>
          <Text type="body2">{typing ? 'Responder' : 'Escribiendo'}</Text>
        </Pressable>
      </View>
      {log && (
        <Text className="text-gray-600" type="caption">
          {log}
        </Text>
      )}
    </View>
  )
}

export const Conversacion: Story = { render: () => <Conversation /> }
