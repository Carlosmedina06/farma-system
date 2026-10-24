import { SafeAreaView } from 'react-native-safe-area-context'
import { withUniwind } from 'uniwind'

/** `SafeAreaView` con soporte de `className` (Uniwind). */
export const UniwindSafeAreaView = withUniwind(SafeAreaView)
