import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { Text } from '@farma/registry/ui/text'
import { getHP, getWP } from '@farma/registry/lib/dimensions'

interface FeedbackModalProps {
  circumferenceColor?: string
  preContent?: React.ReactNode
  title?: string
  description?: string
  formattedDescription?: React.ReactNode
  withStatusBar?: boolean
  illustrationTopPaddingExtra?: number
}

const FeedbackModal = ({
  circumferenceColor = '#248db0',
  preContent,
  title = '',
  description = 'We appreciate your feedback!',
  formattedDescription,
  withStatusBar = true,
  illustrationTopPaddingExtra = 0,
}: FeedbackModalProps) => {
  const circumferenceSize = getWP(130)
  const illustrationTopPadding = getHP(14.4) + illustrationTopPaddingExtra
  const illustrationHeight = getHP(19)
  const illustrationWidth = getWP(44.68)
  const textPaddingHorizontal = getWP(4.44)

  return (
    <AnimatedLayout
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        width: '100%',
      }}
    >
      {withStatusBar ? <StatusBar style="light" /> : null}
      <View className="relative w-full flex-1 overflow-hidden">
        <View
          className="absolute rounded-full"
          style={{
            borderRadius: circumferenceSize / 2,
            top: -circumferenceSize / 2,
            left: '50%',
            transform: [{ translateX: -circumferenceSize / 2 }],
            backgroundColor: circumferenceColor,
            width: circumferenceSize,
            height: circumferenceSize,
          }}
        />
        <View className="w-full flex-1 flex-col items-center justify-start">
          <View
            className="items-center justify-center"
            style={{
              width: illustrationWidth,
              minHeight: illustrationHeight,
              paddingTop: illustrationTopPadding,
            }}
          >
            {preContent && (
              <View
                style={{
                  width: illustrationWidth,
                  height: illustrationHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {preContent}
              </View>
            )}
          </View>
          <View
            className="w-full flex-1 flex-col items-center gap-4"
            style={{
              marginTop: getHP(2),
              paddingHorizontal: textPaddingHorizontal,
              paddingVertical: getHP(3),
            }}
          >
            {Boolean(title) && (
              <Text className="text-center text-gray-800" style={{ width: '100%' }} type="h1">
                {title}
              </Text>
            )}
            {formattedDescription ??
              (description ? (
                <Text className="text-center text-gray-800" style={{ width: '100%' }} type="body1">
                  {description}
                </Text>
              ) : null)}
          </View>
        </View>
      </View>
    </AnimatedLayout>
  )
}

export default FeedbackModal
