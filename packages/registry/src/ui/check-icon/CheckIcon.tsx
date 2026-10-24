import Svg, { Path } from 'react-native-svg'

export interface CheckIconProps {
  /** Ancho y alto en px. */
  size?: number
  color?: string
  strokeWidth?: number
  testID?: string
}

/** Check de validación (24×24) usado en campos válidos (`assets/svg/icons/check.svg`). */
export const CheckIcon = ({ size = 24, color = '#475467', strokeWidth = 2, testID }: CheckIconProps) => (
  <Svg fill="none" height={size} testID={testID} viewBox="0 0 24 24" width={size}>
    <Path
      d="M20 6L9 17L4 12"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </Svg>
)

export interface CheckboxCheckIconProps {
  size?: number
  strokeColor?: string
  strokeWidth?: number
  testID?: string
}

/** Check compacto (viewBox 17×17) usado dentro del Checkbox (`assets/svg/icons/check.tsx`). */
export const CheckboxCheckIcon = ({
  size = 17,
  strokeColor = 'white',
  strokeWidth = 2,
  testID,
}: CheckboxCheckIconProps) => (
  <Svg fill="none" height={size} testID={testID} viewBox="0 0 17 17" width={size}>
    <Path
      d="M14 4.20001L6.3 11.9L2.8 8.40001"
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    />
  </Svg>
)
