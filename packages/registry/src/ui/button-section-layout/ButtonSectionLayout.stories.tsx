import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Counter } from '../counter'
import ButtonSectionLayout from './ButtonSectionLayout'
import type { ButtonSectionVariant } from './ButtonSectionLayout.types'

const VARIANTS: ButtonSectionVariant[] = [
  'verticalSingleButton',
  'verticalSingleButtonWithAmount',
  'verticalSingleButtonWithText',
  'verticalTwoButtons',
  'verticalPrimaryWithLinkPrompt',
  'horizontalTwoButtons',
  'horizontalTwoButtonsFilters',
  'verticalTwoButtonsWithAmount',
  'verticalTwoButtonsWithSummary',
  'verticalSingleButtonWithHeader',
  'actionSlotWithButton',
]

const noop = () => {}
const formatCurrency = (value: number) =>
  value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

const meta = {
  title: 'Moléculas/ButtonSectionLayout',
  component: ButtonSectionLayout,
  args: {
    variant: 'verticalSingleButton',
    primaryButton: { children: 'Continuar', onPress: noop },
    secondaryButton: { children: 'Cancelar', type: 'secondary', onPress: noop },
    amountText: 'Total',
    amountValue: 12500,
    formatAmount: formatCurrency,
    className: 'p-padding-xl gap-padding-xl',
  },
  argTypes: { variant: { control: 'select', options: VARIANTS } },
  decorators: [
    (Story) => (
      <View className="bg-gray-100 py-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ButtonSectionLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const VerticalSingleButton: Story = { args: { variant: 'verticalSingleButton' } }

export const VerticalSingleButtonWithAmount: Story = {
  args: { variant: 'verticalSingleButtonWithAmount' },
}

export const VerticalSingleButtonWithText: Story = {
  args: { variant: 'verticalSingleButtonWithText', amountLabel: 'Total', amountText: '3 ítems' },
}

export const VerticalTwoButtons: Story = { args: { variant: 'verticalTwoButtons' } }

export const VerticalPrimaryWithLinkPrompt: Story = {
  args: {
    variant: 'verticalPrimaryWithLinkPrompt',
    promptText: '¿Ya tenés cuenta?',
    secondaryButton: { children: 'Ingresar', onPress: noop },
  },
}

export const HorizontalTwoButtons: Story = {
  args: {
    variant: 'horizontalTwoButtons',
    className: undefined,
    primaryButton: { children: 'Aceptar', full: false, onPress: noop },
    secondaryButton: { children: 'Cancelar', full: false, type: 'secondary', onPress: noop },
  },
}

export const HorizontalTwoButtonsFilters: Story = {
  args: {
    variant: 'horizontalTwoButtonsFilters',
    className: undefined,
    primaryButton: { children: 'Aplicar', onPress: noop },
    secondaryButton: { children: 'Limpiar', type: 'secondary', onPress: noop },
  },
}

export const VerticalTwoButtonsWithAmount: Story = {
  args: { variant: 'verticalTwoButtonsWithAmount' },
}

export const VerticalTwoButtonsWithAmountLoading: Story = {
  args: { variant: 'verticalTwoButtonsWithAmount', isLoading: true },
}

export const VerticalTwoButtonsWithSummary: Story = {
  args: { variant: 'verticalTwoButtonsWithSummary', amountValue: 'A confirmar' },
}

export const VerticalSingleButtonWithHeader: Story = {
  args: {
    variant: 'verticalSingleButtonWithHeader',
    headerIcon: 'marker-pin-02',
    headerTitle: 'Título del encabezado',
    headerCaption: 'Texto secundario del encabezado',
    secondaryButton: { children: 'Cambiar', type: 'textLink', size: 'sm', full: false, onPress: noop },
  },
}

export const ActionSlotWithButton: Story = {
  args: {
    variant: 'actionSlotWithButton',
    amountText: 'Nombre del ítem',
    amountCaption: 'Detalle',
    amountValue: '$ 12.500,00',
    primaryButton: { children: 'Agregar', onPress: noop },
    renderAction: () => <Counter className="h-full self-stretch" value={1} />,
  },
}
