import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { ListBold } from './ListBold'
import { ListIcon } from './ListIcon'
import { ListSingleLine } from './ListSingleLine'

const meta = {
  title: 'Átomos/List',
  component: ListBold,
  args: {
    icon: 'check',
    label: 'Título del ítem',
    description: 'Descripción del ítem que puede ocupar varias líneas si el texto es largo.',
  },
} satisfies Meta<typeof ListBold>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const ListBoldVariantes: Story = {
  render: () => (
    <View className="gap-6">
      <ListBold caption="12:30" icon="bell-03" label="Con caption" />
      <ListBold caption={() => 'Ayer'} description="Caption como función" icon="bell-03" label="Caption fn" />
      <ListBold icon="marker-pin-02" label="Con link" textLinkLabel="Editar" onTextLinkPress={() => {}} />
      <ListBold icon="home-05" label="Con icono derecho" rightIcon="chevron-right" />
      <ListBold isListLight icon="check" label="Label liviano" />
      <ListBold
        additionalDescription="Descripción adicional"
        description="Descripción"
        footnote="Nota al pie"
        icon="info-circle"
        label="Todos los textos"
      />
      <ListBold disabled icon="check" label="Ítem deshabilitado" subtitle="No disponible" />
    </View>
  ),
}

export const ListIconStory: Story = {
  name: 'ListIcon',
  render: () => <ListIcon description="Descripción en una línea" icon="stars-selected" label="Label" />,
}

export const ListSingleLineStory: Story = {
  name: 'ListSingleLine',
  render: () => <ListSingleLine description="Valor" label="Label" />,
}
