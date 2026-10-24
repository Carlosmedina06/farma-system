import { createIconSet } from '@react-native-vector-icons/common'

import fontSource from '@farma/assets/fonts/farmaIcons.ttf'

import glyphMap from './glyph-map.json'

const BaseFarmaIcon = createIconSet(glyphMap, {
  postScriptName: 'farmaIcons',
  fontFileName: 'farmaIcons.ttf',
  fontSource: fontSource as number,
})

export const FarmaIcon = BaseFarmaIcon

export default FarmaIcon
