import { Dimensions } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

export const circumferenceSize = screenWidth * 1.2
export const circumferenceSpace = (circumferenceSize / 2) * 0.4
export const circumferenceNegativeMargin = 16
