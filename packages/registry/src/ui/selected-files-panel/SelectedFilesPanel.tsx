import { View } from 'react-native'
import { Button } from '@farma/registry/ui/button'
import { cn } from '@farma/registry/lib/utils'

import SelectedFilesPreview from './components/SelectedFilesPreview'
import type { SelectedFilesPanelProps } from './SelectedFilesPanel.types'

/** Panel con la vista previa de archivos seleccionados y un botón principal de acción. */
export default function SelectedFilesPanel({
  files,
  isLoading = false,
  isProcessing = false,
  processLabel = 'Continuar',
  onRemoveFile,
  onProcess,
  getRemoveAccessibilityLabel,
  className,
  testID = 'selected-files-panel',
}: SelectedFilesPanelProps) {
  return (
    <View className={cn('bg-base-white px-padding-xl py-padding-xl gap-4 pb-16', className)} testID={testID}>
      <SelectedFilesPreview
        files={files}
        getRemoveAccessibilityLabel={getRemoveAccessibilityLabel}
        isLoading={isLoading}
        testID={`${testID}-preview`}
        onRemoveFile={onRemoveFile}
      />
      <Button disabled={isLoading} full loading={isProcessing} testID={`${testID}-process`} type="primary" onPress={onProcess}>
        {processLabel}
      </Button>
    </View>
  )
}
