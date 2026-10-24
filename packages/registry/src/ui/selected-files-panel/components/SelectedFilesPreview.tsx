import { Image, Pressable, ScrollView, View } from 'react-native'
import { AnimatedLayout } from '@farma/registry/ui/animated-layout'
import { Icon } from '@farma/registry/ui/icon'
import { ShimmerSkeleton } from '@farma/registry/ui/shimmer-skeleton'
import { Text } from '@farma/registry/ui/text'
import { cn } from '@farma/registry/lib/utils'

import { getFileExtension, getFileNameWithoutExtension } from '../files'
import type { SelectedFile, SelectedFilesPreviewProps } from '../SelectedFilesPanel.types'
import PdfIcon from './PdfIcon'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']

const defaultRemoveAccessibilityLabel = (fileName: string) => `Quitar ${fileName}`

const getImageUri = (uri: string) => (uri && uri.startsWith('/') ? `file://${uri}` : uri)

function FileThumbnail({ file, testID }: Readonly<{ file: SelectedFile; testID?: string }>) {
  const extension = getFileExtension(file.fileName)

  if (extension === 'pdf') {
    return (
      <View className="h-14 w-14 items-center justify-center" testID={testID && `${testID}-pdf`}>
        <PdfIcon height={56} width={56} />
      </View>
    )
  }

  if (extension && IMAGE_EXTENSIONS.includes(extension) && file.data.uri) {
    return (
      <View className="h-14 w-14 items-center justify-center overflow-hidden rounded" testID={testID && `${testID}-image`}>
        <Image className="h-14 w-14 rounded" resizeMode="cover" source={{ uri: getImageUri(file.data.uri) }} />
      </View>
    )
  }

  return (
    <View
      className="h-14 w-14 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
      testID={testID && `${testID}-generic`}
    >
      <Icon className="text-gray-600" name="file-01" size={32} />
    </View>
  )
}

/** Carrusel horizontal de archivos seleccionados (PDF, imagen u otro) con botón de quitar y skeleton de carga. */
export default function SelectedFilesPreview({
  files,
  isLoading = false,
  onRemoveFile,
  getRemoveAccessibilityLabel = defaultRemoveAccessibilityLabel,
  className,
  testID = 'selected-files-preview',
}: SelectedFilesPreviewProps) {
  if (files.length === 0 && !isLoading) {
    return null
  }

  return (
    <View className={cn('mb-padding-xl overflow-visible', className)} testID={testID}>
      <ScrollView
        horizontal
        className="overflow-visible"
        contentContainerClassName="pr-6"
        showsHorizontalScrollIndicator={false}
        testID={`${testID}-scroll`}
      >
        {files.map((file, index) => {
          const name = getFileNameWithoutExtension(file.fileName)

          return (
            <AnimatedLayout key={`${file.fileName}-${index}`} className="mr-3 overflow-visible pt-3">
              <View className="gap-gap-xxs items-start">
                <View className="relative overflow-visible">
                  <FileThumbnail file={file} testID={`${testID}-thumb-${index}`} />
                  <Pressable
                    accessibilityLabel={getRemoveAccessibilityLabel(name)}
                    accessibilityRole="button"
                    className="absolute -top-[7px] -right-[7px] z-10 h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white"
                    testID={`${testID}-delete-${index}`}
                    onPress={() => onRemoveFile(index)}
                  >
                    <Icon className="text-gray-900" name="x" size={16} />
                  </Pressable>
                </View>
                <Text
                  semibold
                  className="w-20 text-left text-gray-800"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  testID={`${testID}-name-${index}`}
                  type="caption"
                >
                  {name}
                </Text>
              </View>
            </AnimatedLayout>
          )
        })}
        {isLoading ? (
          <View className="gap-gap-xxs items-start pt-3" testID={`${testID}-skeleton`}>
            <ShimmerSkeleton height={56} radius={8} width={56} />
            <ShimmerSkeleton height={12} radius={4} width={64} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}
