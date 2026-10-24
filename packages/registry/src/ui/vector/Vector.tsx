import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { VectorProps } from './Vector.types'

const Vector: React.FC<VectorProps> = ({
  strokeColor = '#D0D5DD',
  height = 32,
  strokeWidth = 2,
  testID,
  ...props
}) => {
  const { ...svgProps } = props

  return (
    <Svg
      {...(svgProps as Record<string, unknown>)}
      fill="none"
      height={height}
      testID={testID}
      viewBox={`0 0 2 ${height}`}
      width={2}
    >
      <Path d={`M1 0V${height}`} stroke={strokeColor} strokeWidth={strokeWidth} />
    </Svg>
  )
}

export default Vector
