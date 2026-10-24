import { useState, type ComponentType, type ReactNode } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import { Text } from '@farma/registry/ui/text'

export type GalleryEntry = { item: string; label: string; render: () => ReactNode }

/** Grilla filtrable de assets del registry, con el nombre del item para `farma-system add`. */
export function AssetGallery({
  entries,
  tileClassName = 'w-[110px]',
  copyPrefix = 'farma-system add ',
}: {
  entries: GalleryEntry[]
  tileClassName?: string
  /** Texto que se copia antes del nombre; '' copia solo el nombre (ej. para <Icon name>). */
  copyPrefix?: string
}) {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string>()
  const filtered = entries.filter((entry) => entry.item.toLowerCase().includes(query.toLowerCase()))

  return (
    <View className="gap-3">
      <TextInput
        className="rounded-sm border border-gray-300 px-3 py-2"
        placeholder={`Buscar entre ${entries.length} items…`}
        value={query}
        onChangeText={setQuery}
      />
      {copied && <Text type="caption">Copiado: {copyPrefix}{copied}</Text>}
      <View className="flex-row flex-wrap gap-3">
        {filtered.map((entry) => (
          <Pressable
            key={entry.item}
            className={`${tileClassName} items-center gap-1 rounded-md border border-gray-200 p-2`}
            onPress={() => {
              void globalThis.navigator?.clipboard?.writeText(`${copyPrefix}${entry.item}`)
              setCopied(entry.item)
            }}
          >
            <View className="h-[80px] w-full items-center justify-center">{entry.render()}</View>
            <Text className="text-center" numberOfLines={2} type="caption">
              {entry.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

type SvgModule = { default: ComponentType<{ width?: number | string; height?: number | string; color?: string }> }
type Manifest = { name: string; files: { path: string }[] }[]

/** Une los componentes SVG generados con sus manifiestos (`registry-items.json`) para saber el nombre de item. */
export function svgEntries(
  modules: Record<string, unknown>,
  manifests: Record<string, unknown>,
  size: { width: number | string; height: number | string },
): GalleryEntry[] {
  const itemByFile = new Map<string, string>()
  for (const [manifestPath, manifest] of Object.entries(manifests)) {
    const dir = manifestPath.slice(0, manifestPath.lastIndexOf('/'))
    for (const item of (manifest as { default: Manifest }).default) {
      for (const file of item.files) itemByFile.set(`${dir}/${file.path}`, item.name)
    }
  }
  return Object.entries(modules)
    .map(([file, mod]) => {
      const Component = (mod as SvgModule).default
      const item = itemByFile.get(file) ?? file
      return {
        item,
        label: item,
        render: () => <Component color="#344054" height={size.height} width={size.width} />,
      }
    })
    .sort((a, b) => a.item.localeCompare(b.item))
}
