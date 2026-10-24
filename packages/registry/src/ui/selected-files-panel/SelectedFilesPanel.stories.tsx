import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import SelectedFilesPanel from './SelectedFilesPanel'
import type { SelectedFile, SelectedFilesPanelProps } from './SelectedFilesPanel.types'

const SAMPLE_FILES: SelectedFile[] = [
  { fileName: 'Documento escaneado.pdf', data: { uri: 'file:///doc.pdf', type: 'application/pdf' } },
  { fileName: 'Foto.jpg', data: { uri: 'https://picsum.photos/200', type: 'image/jpeg' } },
  { fileName: 'Planilla.xlsx', data: { uri: 'file:///planilla.xlsx' } },
]

type DemoProps = Omit<SelectedFilesPanelProps, 'files' | 'onRemoveFile' | 'onProcess'> & { initialFiles?: SelectedFile[] }

function SelectedFilesPanelDemo({ initialFiles = SAMPLE_FILES, ...props }: DemoProps) {
  const [files, setFiles] = useState(initialFiles)
  const [processing, setProcessing] = useState(false)

  const onProcess = () => {
    setProcessing(true)
    setTimeout(() => setProcessing(false), 1500)
  }

  return (
    <View>
      <SelectedFilesPanel
        isProcessing={processing}
        {...props}
        files={files}
        onProcess={onProcess}
        onRemoveFile={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
      />
    </View>
  )
}

const meta = {
  title: 'Moléculas/SelectedFilesPanel',
  component: SelectedFilesPanelDemo,
  args: { processLabel: 'Continuar', isLoading: false },
} satisfies Meta<typeof SelectedFilesPanelDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Cargando: Story = { args: { isLoading: true } }

export const SoloSkeleton: Story = { args: { isLoading: true, initialFiles: [] } }

export const Procesando: Story = { args: { isProcessing: true } }
