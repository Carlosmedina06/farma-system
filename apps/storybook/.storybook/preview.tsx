import '../global.css'
import './fonts.css'

import type { Preview } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { SafeAreaInsetsContext, SafeAreaProvider } from 'react-native-safe-area-context'

import { PortalHost } from '@farma/registry/ui/portal'
import { FeedbackScreenHost } from '@farma/registry/ui/feedback-screen'
import { ModalHost } from '@farma/registry/ui/modal'
import { OptionModalHost } from '@farma/registry/ui/option-modal'
import { ToastHost } from '@farma/registry/ui/toast'

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

const IPHONE_15_INSETS = { top: 59, right: 0, bottom: 34, left: 0 }

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
      <View style={{ flex: 1, height: '100%' }}>
        <SafeAreaProvider>
          <SafeAreaInsetsContext.Provider value={IPHONE_15_INSETS}>
            <View className="flex-1 bg-white p-4">
              <Story />
            </View>
            <ModalHost />
            <OptionModalHost />
            <FeedbackScreenHost />
            <PortalHost />
            <ToastHost topOffset={IPHONE_15_INSETS.top + 16} />
          </SafeAreaInsetsContext.Provider>
        </SafeAreaProvider>
      </View>
    ),
  ],
}

export default preview
