import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { View } from 'react-native'

import { Button } from '../button/Button'
import { Text } from '../text'
import { OptionModal } from './OptionModal'
import { optionModal, useOptionModal } from './OptionModalHost'
import type { ModalOption } from './OptionModal.types'

const OPTIONS: ModalOption[] = [
  { label: 'Ya no lo necesito', value: 'not-needed' },
  { label: 'Encontré una mejor opción', value: 'better' },
  { label: 'Otro', value: 'other' },
]

const FREE_TEXT = { value: 'other', minLength: 10, placeholder: 'Contanos más' }

/** Sin Host: la pantalla maneja visible y la selección con useState. */
function Controlled() {
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<ModalOption>()

  return (
    <View className="gap-3">
      <Button onPress={() => setVisible(true)}>Abrir (sin Host)</Button>
      <Text type="body2">Elegido: {selected ? `${selected.label} ${selected.otherText ?? ''}` : '—'}</Text>
      <OptionModal
        close={() => setVisible(false)}
        freeTextOption={FREE_TEXT}
        options={OPTIONS}
        primaryAction={{ children: 'Enviar', onPress: () => setVisible(false) }}
        secondaryAction={{ children: 'Omitir', onPress: () => setVisible(false) }}
        title="¿Por qué lo cancelás?"
        visible={visible}
        onSelectOption={setSelected}
      />
    </View>
  )
}

/** Con `<OptionModalHost />` montado en el root. */
function WithHost() {
  const { showModal, selectedOption } = useOptionModal()

  return (
    <View className="gap-3">
      <Button
        onPress={() =>
          showModal({
            title: '¿Por qué lo cancelás?',
            options: OPTIONS,
            freeTextOption: FREE_TEXT,
            primaryAction: { children: 'Enviar', onPress: optionModal.hide },
          })
        }
      >
        optionModal.show()
      </Button>
      <Text type="body2">Seleccionado: {selectedOption?.label ?? '—'}</Text>
    </View>
  )
}

const meta = { title: 'Globales/OptionModal', component: Controlled } satisfies Meta<typeof Controlled>

export default meta

export const SinHost: StoryObj<typeof meta> = {}

export const ConHost: StoryObj<typeof meta> = { render: () => <WithHost /> }
