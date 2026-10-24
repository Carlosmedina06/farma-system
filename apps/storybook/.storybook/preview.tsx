import '../global.css'

import type { Preview } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

/** Viewports de dispositivos para ver los componentes como en la app. */
const MOBILE_VIEWPORTS = {
  iphone15: {
    name: 'iPhone 15',
    styles: { width: '393px', height: '852px' },
    type: 'mobile',
  },
  iphoneSE: {
    name: 'iPhone SE',
    styles: { width: '375px', height: '667px' },
    type: 'mobile',
  },
  pixel8: {
    name: 'Pixel 8',
    styles: { width: '412px', height: '915px' },
    type: 'mobile',
  },
  tablet: {
    name: 'iPad mini',
    styles: { width: '744px', height: '1133px' },
    type: 'tablet',
  },
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    viewport: { options: MOBILE_VIEWPORTS },
    controls: {
      matchers: { color: /(background|color)$/i },
    },
  },
  initialGlobals: {
    viewport: { value: 'iphone15', isRotated: false },
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View className="flex-1 bg-white p-4">
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
}

export default preview
