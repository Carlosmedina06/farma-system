import { Text } from '@farma/registry/ui/text'

import type { ParseTextProps } from '../TextWithBold.types'
import { findBoldText, removeBoldSimbol, splitRegularText } from '../TextWithBold.utils'

// Bold text must be encapsulated between the symbols #** **#:
// 'Regular text example #**bold text example**# continues regular text'

/** Renderiza un segmento: en negrita si viene como `**…**`, si no palabra por palabra. */
export const ParseText = ({ textColor, textType, text }: ParseTextProps) => {
  if (!text) {
    return null
  }

  if (findBoldText(text)) {
    return (
      <Text semibold className={textColor} type={textType}>
        {removeBoldSimbol(text)}&nbsp;
      </Text>
    )
  }

  return (
    <>
      {splitRegularText(text).map((segment, indx) => (
        <Text key={indx} className={textColor} type={textType}>
          {segment}&nbsp;
        </Text>
      ))}
    </>
  )
}

export default ParseText
