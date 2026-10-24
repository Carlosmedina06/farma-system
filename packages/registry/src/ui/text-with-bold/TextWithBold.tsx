import { useMemo } from 'react'
import { View } from 'react-native'
import { cn } from '@farma/registry/lib/utils'

import ParseText from './ParseText/ParseText'
import { TextAlignMapper, type TextWithBoldProps } from './TextWithBold.types'
import { splitBoldText } from './TextWithBold.utils'

/** Texto con segmentos en negrita: `'Texto normal #**en negrita**# sigue normal'`. */
export const TextWithBold = ({
  textAlign,
  textColor,
  text,
  textType,
  className,
  testID,
  style,
  ...restProps
}: TextWithBoldProps) => {
  const parsedText = useMemo(() => (text ? splitBoldText(text) : null), [text])

  const justifyContent = textAlign ? TextAlignMapper[textAlign] : 'flex-start'

  return (
    <View
      className={cn('flex-row flex-wrap items-center', className)}
      style={[{ justifyContent }, style]}
      testID={testID}
      {...restProps}
    >
      {parsedText?.map((segment, indx) => (
        <ParseText
          key={indx}
          position={indx}
          text={segment}
          textAlign={textAlign}
          textColor={textColor}
          textType={textType}
        />
      ))}
    </View>
  )
}

export default TextWithBold
