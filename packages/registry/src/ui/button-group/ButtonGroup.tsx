import { useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { tv } from 'tailwind-variants'
import { Icon } from '@farma/registry/ui/icon'
import { Text } from '@farma/registry/ui/text'

import {
  ButtonGroupProps,
  ButtonItem,
  findIconInButtons,
  getButtonPossition,
} from './ButtonGroup.types'

const buttonGroupContainerVariants = tv({
  base: 'flex-row items-center',
})

const buttonItemVariants = tv({
  base: 'flex-row items-center border border-gray-300 px-padding-2xl py-padding-md gap-2',
  variants: {
    buttonPosition: {
      first: 'rounded-tl-sm rounded-bl-sm',
      middle: 'rounded-none border-l-0',
      last: 'rounded-tr-sm rounded-br-sm border-l-0 rounded-tl-none rounded-bl-none',
    },
    isPressed: {
      true: 'bg-gray-50',
      false: '',
    },
    hasIcon: {
      true: 'min-h-[42px]',
      false: '',
    },
  },
})

const ButtonGroupItem = ({
  text,
  icon,
  index,
  totalItems,
  hasIcon,
  onPress,
  testID,
}: ButtonItem) => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const onPressIn = () => setIsPressed(true)
  const onPressOut = () => setIsPressed(false)

  return (
    <View key={`${index}-${text}`}>
      <Pressable
        className={buttonItemVariants({
          buttonPosition: getButtonPossition(index, totalItems),
          hasIcon,
          isPressed,
        })}
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {icon && <Icon color="#475467" name={icon} size={20} />}
        <Text semibold type="body2">
          {text}
        </Text>
      </Pressable>
    </View>
  )
}

export const ButtonGroup = ({ buttons, testID }: ButtonGroupProps) => {
  return (
    <View className={buttonGroupContainerVariants()}>
      <FlatList
        horizontal
        data={buttons}
        keyExtractor={(item) => item?.id ?? ''}
        testID={testID ?? 'button-group'}
        renderItem={({ item, index }) => (
          <ButtonGroupItem
            hasIcon={findIconInButtons(buttons)}
            icon={item.icon}
            index={index}
            testID={testID ? `${testID}-item-${item.id}` : `button-group-item-${item.id}`}
            text={item.text}
            totalItems={buttons.length}
            onPress={item.onPress}
          />
        )}
      />
    </View>
  )
}
