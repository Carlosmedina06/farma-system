require('@testing-library/react-native/extend-expect')
require('react-native-gesture-handler/jestSetup')

jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAvoidingView: ({ children }) => children,
  KeyboardAwareScrollView: ({ children }) => children,
}))

jest.mock('lottie-react-native', () => {
  const { View } = require('react-native')
  const React = require('react')
  return {
    __esModule: true,
    default: React.forwardRef((props, ref) => React.createElement(View, { ...props, ref, testID: props.testID ?? 'lottie-view' })),
  }
})
