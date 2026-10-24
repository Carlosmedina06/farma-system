import { useFonts } from 'expo-font'

import interBold from '@farma/assets/fonts/Inter-Bold.ttf'
import interMedium from '@farma/assets/fonts/Inter-Medium.ttf'
import interRegular from '@farma/assets/fonts/Inter-Regular.ttf'
import interSemiBold from '@farma/assets/fonts/Inter-SemiBold.ttf'
import manropeSemiBold from '@farma/assets/fonts/Manrope-SemiBold.ttf'
import farmaIcons from '@farma/assets/fonts/farmaIcons.ttf'

/** Fuentes del design system, con el nombre de familia que usan Text e Icon. */
export const farmaFonts = {
  farmaIcons,
  'Inter-Bold': interBold,
  'Inter-SemiBold': interSemiBold,
  'Inter-Medium': interMedium,
  'Inter-Regular': interRegular,
  'Manrope-SemiBold': manropeSemiBold,
} as Record<string, number>

/**
 * Carga las fuentes del DS. No bloquea nada: la app decide qué hacer
 * mientras cargan (splash, null, etc.). Devuelve `[loaded, error]` igual que `useFonts`.
 *
 * Alternativa sin JS: registrar `farmaFonts` en el plugin `expo-font` de app.config.
 */
export function useFarmaFonts() {
  return useFonts(farmaFonts)
}
