import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Pressable, View } from 'react-native'

import { Text } from '../text'
import { ActionSheet } from './ActionSheet'
import type { ActionSheetOption, ActionSheetProps } from './ActionSheet.types'

function Demo(props: ActionSheetProps) {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string>()

  const options: ActionSheetOption[] = props.options.map((option) => ({
    ...option,
    onPress: () => {
      setLast(option.label)
      setOpen(false)
    },
  }))

  return (
    <View className="w-80 gap-3">
      <Pressable className="bg-primary-600 self-start rounded-md px-4 py-2" onPress={() => setOpen(true)}>
        <Text className="text-white" type="body2">
          Abrir
        </Text>
      </Pressable>
      <Text className="text-gray-600" type="caption">
        Última opción: {last ?? '—'}
      </Text>
      <ActionSheet {...props} close={() => setOpen(false)} open={open} options={options} />
    </View>
  )
}

const UPLOAD_OPTIONS: ActionSheetOption[] = [
  { key: 'document', label: 'Seleccionar documento', icon: 'file-05', onPress: () => {} },
  { key: 'gallery', label: 'Seleccionar imagen desde galería', icon: 'image-plus', onPress: () => {} },
  { key: 'camera', label: 'Tomar foto', icon: 'camera-plus', onPress: () => {} },
]

const meta = {
  title: 'Moléculas/ActionSheet',
  component: ActionSheet,
  args: {
    open: false,
    close: () => {},
    title: 'Elegí una opción',
    options: [
      { key: 'share', label: 'Compartir', icon: 'share-07', onPress: () => {} },
      { key: 'copy', label: 'Copiar enlace', icon: 'copy-01', onPress: () => {} },
      { key: 'delete', label: 'Eliminar', icon: 'trash-01', description: 'No se puede deshacer', onPress: () => {} },
    ],
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<typeof ActionSheet>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Caso de uso: subir un archivo (copy pasado como datos, no incluido en el componente). */
export const SubirArchivo: Story = {
  args: { title: 'Subir archivo', options: UPLOAD_OPTIONS, description: 'Podés subir archivos de hasta 5 MB' },
}

export const ConOpcionDeshabilitada: Story = {
  args: {
    options: [
      ...UPLOAD_OPTIONS.slice(0, 2),
      { ...UPLOAD_OPTIONS[2], disabled: true, description: 'Cámara no disponible' },
    ],
  },
}
