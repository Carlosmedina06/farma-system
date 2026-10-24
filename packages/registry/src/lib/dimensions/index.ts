import { Dimensions } from 'react-native'

/** Porcentaje del ancho de la ventana. */
export const getWP = (percentage: number) => Dimensions.get('window').width * (percentage / 100)

/** Porcentaje del alto de la ventana. */
export const getHP = (percentage: number) => Dimensions.get('window').height * (percentage / 100)
