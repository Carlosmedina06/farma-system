import { Fragment, ReactElement, useRef, useState } from 'react'
import { useKeyboard } from '@react-native-community/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  FlatList,
  Keyboard,
  ListRenderItemInfo,
  Pressable,
  View,
  type TextInputInstance,
} from 'react-native'

import { BottomSheet } from '@farma/registry/ui/bottom-sheet'
import { type IconName } from '@farma/registry/ui/icon'
import { Input } from '@farma/registry/ui/input'
import { Search } from '@farma/registry/ui/search'

import { DropdownItem } from './DropdownItem'

export type DropdownOption = {
  value: string
  label: string
  description?: string
  icon?: IconName
}

export type DropdownProps<T> = {
  placeholder?: string
  options: T[]
  value?: T
  title?: string
  onChange?: (value: T) => void
  renderItem?: (value: ListRenderItemInfo<T>, selected: T | undefined, select: () => void) => ReactElement
  keyExtractor?: (value: T) => string
  filterCriteria?: (item: T, searchText: string) => boolean
  labelExtractor?: (value?: T) => string
  /** Transforma label/description de cada opción en el `renderItem` por defecto (identidad por defecto). */
  formatLabel?: (label: string) => string
  /** Por defecto "Buscar". */
  searchPlaceholder?: string
  search?: boolean
  /** Por defecto `title ?? placeholder ?? 'Selector'`. */
  accessibilityLabel?: string
  accessibilityHint?: string
  testID?: string
}

const defaultKeyExtractor = (item: DropdownOption) => item.value

const defaultFilterCriteria = (item: DropdownOption, searchText: string) =>
  (item.label ?? '').toLowerCase().includes(searchText.toLowerCase())

const defaultLabelExtractor = (item?: DropdownOption) => item?.label || ''

export const Dropdown = <T extends DropdownOption>({
  placeholder,
  value,
  onChange,
  options,
  searchPlaceholder,
  title,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  filterCriteria = defaultFilterCriteria,
  labelExtractor = defaultLabelExtractor,
  formatLabel,
  search: withSearch,
  accessibilityLabel,
  accessibilityHint,
  testID = 'dropdown',
}: DropdownProps<T>) => {
  const inputRef = useRef<TextInputInstance>(null)
  const searchInputRef = useRef<TextInputInstance>(null)
  const { keyboardShown } = useKeyboard()
  const { bottom: safeBottom } = useSafeAreaInsets()
  const listContentBottomPadding = safeBottom + 16

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const labelValue = labelExtractor(value) || ''

  const renderOption =
    renderItem ??
    (({ item }: ListRenderItemInfo<T>, selected: T | undefined, select: () => void) => (
      <DropdownItem
        {...item}
        formatLabel={formatLabel}
        selected={item.value === selected?.value}
        onPress={select}
      />
    ))

  const openBottomSheet = () => {
    setOpen(true)
    setSearch('')
    Keyboard.dismiss()
  }

  const closeBottomSheet = () => {
    setOpen(false)
    inputRef.current?.blur()
  }

  const onSelect = (option: T) => {
    inputRef.current?.blur()
    onChange?.(option)
    closeBottomSheet()
  }

  const filteredOptions = search.length > 0 ? options.filter((option) => filterCriteria(option, search)) : options

  return (
    <>
      <View accessible={false} className="relative">
        <Input
          accessibilityElementsHidden
          accessible={false}
          className="h-14"
          editable={false}
          icon={{
            name: 'chevron-down',
            size: 24,
            color: '$gray600',
          }}
          importantForAccessibility="no-hide-descendants"
          inputRef={inputRef}
          placeholder={placeholder}
          testID={`${testID}-input`}
          value={labelValue}
        />
        <Pressable
          accessibilityHint={accessibilityHint}
          accessibilityLabel={accessibilityLabel ?? title ?? placeholder ?? 'Selector'}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessible
          className="absolute inset-0"
          style={{ minHeight: 44 }}
          testID={`${testID}-trigger`}
          onPress={openBottomSheet}
        />
      </View>

      <BottomSheet
        close={closeBottomSheet}
        content={Fragment}
        full={Boolean(withSearch && keyboardShown)}
        heightPercent={withSearch && !keyboardShown ? 0.52 : undefined}
        open={open}
        testID={`${testID}-bottom-sheet`}
        title={title}
      >
        {withSearch ? (
          <View className="min-h-0 flex-1">
            <View className="px-padding-xl pt-gap-xs pb-gap-sm border-b border-gray-100">
              <Search
                inputRef={searchInputRef}
                placeholder={searchPlaceholder ?? 'Buscar'}
                testID={`${testID}-search`}
                value={search}
                onChangeText={setSearch}
                onClear={() => setSearch('')}
              />
            </View>
            <FlatList
              className="flex-1"
              contentContainerStyle={{ paddingBottom: listContentBottomPadding }}
              data={filteredOptions}
              keyboardShouldPersistTaps="handled"
              keyExtractor={keyExtractor}
              renderItem={(item) => renderOption(item, value, () => onSelect(item.item))}
              testID={`${testID}-list`}
            />
          </View>
        ) : (
          <View>
            <FlatList
              contentContainerStyle={{ paddingBottom: listContentBottomPadding }}
              data={filteredOptions}
              keyExtractor={keyExtractor}
              renderItem={(item) => renderOption(item, value, () => onSelect(item.item))}
              style={{ flexGrow: 1 }}
              testID={`${testID}-list`}
            />
          </View>
        )}
      </BottomSheet>
    </>
  )
}
