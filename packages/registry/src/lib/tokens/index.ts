import { Platform } from 'react-native'

const isAndroid = Platform.OS === 'android'

/** Tamaño mínimo de un área táctil (WCAG / HIG). */
export const MIN_TOUCH_TARGET_SIZE = 44

export const TOUCH_HIT_SLOP = {
  top: 11,
  bottom: 11,
  left: 11,
  right: 11,
} as const

export const shadowCard = {
  sm: {
    elevation: 4,
    shadowColor: isAndroid ? 'rgba(16, 24, 40, 0.5)' : 'rgba(16, 24, 40, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  md: {
    elevation: 4.5,
    shadowColor: isAndroid ? 'rgba(16, 24, 40, 0.8)' : 'rgba(16, 24, 40, 0.25)',
    shadowOffset: { width: 1, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  lg: {
    elevation: 5,
    shadowColor: isAndroid ? 'rgba(16, 24, 40, 1)' : 'rgba(16, 24, 40, 0.4)',
    shadowOffset: { width: 1, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
} as const

export const shadowTop = {
  elevation: 8,
  shadowColor: isAndroid ? 'rgba(16, 24, 40, 1)' : 'rgba(16, 24, 40, 0.3)',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
} as const

export const shadowBottom = {
  elevation: 8,
  shadowColor: isAndroid ? 'rgba(16, 24, 40, 1)' : 'rgba(16, 24, 40, 0.3)',
  shadowOffset: { width: 0, height: -1 },
  shadowOpacity: 0.4,
  shadowRadius: 8,
} as const
