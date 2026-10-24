import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node22',
  platform: 'node',
  clean: true,
  // El schema del registry se empaqueta dentro del CLI para que funcione publicado.
  noExternal: ['@farma/registry'],
  banner: { js: '#!/usr/bin/env node' },
})
