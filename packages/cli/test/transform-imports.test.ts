import { describe, expect, it } from 'vitest'

import { transformImports } from '../src/utils/transform-imports'

describe('transformImports', () => {
  it('reescribe los imports del registry al alias del proyecto', () => {
    const input = [
      "import { cn } from '@farma/registry/lib/utils'",
      'import { Text } from "@farma/registry/ui/text"',
      "import { View } from 'react-native'",
    ].join('\n')

    expect(transformImports(input, { importAlias: 'src/ds/', assetsAlias: 'assets/farma' })).toBe(
      [
        "import { cn } from 'src/ds/lib/utils'",
        'import { Text } from "src/ds/ui/text"',
        "import { View } from 'react-native'",
      ].join('\n'),
    )
  })

  it('reescribe los assets al alias de assets', () => {
    expect(
      transformImports("import font from '@farma/assets/fonts/Inter.ttf'", {
        importAlias: 'src/ds',
        assetsAlias: 'assets/farma/',
      }),
    ).toBe("import font from 'assets/farma/fonts/Inter.ttf'")
  })
})
