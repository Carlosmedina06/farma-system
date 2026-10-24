import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

import StagedLoadingView from './StagedLoadingView'
import type { LoadingStage } from './StagedLoadingView.types'

const STEPS: LoadingStage[] = [
  { title: 'Buscando información', description: 'Esperá unos instantes...', progress: 33 },
  { title: 'Analizando los datos', description: 'Sólo unos segundos más', progress: 66 },
  { title: 'Preparando resultados', description: 'En breve vas a poder continuar', progress: 100 },
]

function StagedLoadingViewDemo({ autoplay = true, activeStepIndex = 0, progress = 10 }: { autoplay?: boolean; activeStepIndex?: number; progress?: number }) {
  const [value, setValue] = useState(progress)

  useEffect(() => {
    if (!autoplay) {
      setValue(progress)

      return
    }
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 300)

    return () => clearInterval(id)
  }, [autoplay, progress])

  const index = autoplay ? STEPS.findIndex((s) => value <= s.progress) : activeStepIndex

  return (
    <View style={{ height: 600 }}>
      <StagedLoadingView activeStepIndex={index} progress={value} steps={STEPS} />
    </View>
  )
}

const meta = {
  title: 'Moléculas/StagedLoadingView',
  component: StagedLoadingViewDemo,
  args: { autoplay: true, activeStepIndex: 0, progress: 10 },
  argTypes: {
    activeStepIndex: { control: { type: 'range', min: 0, max: 2, step: 1 } },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
} satisfies Meta<typeof StagedLoadingViewDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Estatico: Story = { args: { autoplay: false, activeStepIndex: 1, progress: 50 } }
