import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { Spinner } from './Spinner'

const meta = {
  title: 'Átomos/Spinner',
  component: Spinner,
  args: { size: '3xl' },
  argTypes: { size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] } },
} satisfies Meta<typeof Spinner>

export default meta

export const Default: StoryObj<typeof meta> = {}
