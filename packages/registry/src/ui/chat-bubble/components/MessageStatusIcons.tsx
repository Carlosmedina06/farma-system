import Svg, { Path, type SvgProps } from 'react-native-svg'

const DOUBLE_CHECK_PATH =
  'M13.501 0.109192L14 0.595967L8.60039 8.00024L6.41162 5.83858L7.33853 4.56668L8.60039 5.30262L13.501 0.109192ZM9.11876 -0.000183105L9.61773 0.486592L4.21816 7.89086L0.499512 4.2334L1.32984 3.42336L4.21816 5.19325L9.11876 -0.000183105Z'

const READ_COLOR = '#5864F8'
const UNREAD_COLOR = '#98A2B3'

type StatusIconProps = SvgProps & { color?: string }

const DoubleCheck = ({ color, ...props }: StatusIconProps & { color: string }) => (
  <Svg fill="none" height={8} viewBox="0 0 14 8" width={14} {...props}>
    <Path clipRule="evenodd" d={DOUBLE_CHECK_PATH} fill={color} fillRule="evenodd" />
  </Svg>
)

export const MessageReadIcon = ({ color = READ_COLOR, ...props }: StatusIconProps) => (
  <DoubleCheck color={color} testID="message-read-icon" {...props} />
)

export const MessageUnreadIcon = ({ color = UNREAD_COLOR, ...props }: StatusIconProps) => (
  <DoubleCheck color={color} testID="message-unread-icon" {...props} />
)
