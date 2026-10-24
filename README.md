# farma-system

Design system de Farma para **React Native + Expo SDK 58 + Uniwind**, distribuido al estilo **shadcn/ui**:
en lugar de instalar una librería completa, un CLI copia a tu app **solo** los componentes que pides
(y sus dependencias). El código queda en tu proyecto y es tuyo.

## Estructura

```
apps/storybook       Storybook web (react-native-web + Vite + Uniwind) con viewports de móvil
packages/registry    Fuente de los componentes + registry.json + build a dist/r
packages/cli         CLI `farma-system` (init, add, list)
```

## Requisitos

- Node 24 (`.nvmrc`) y pnpm 12

```sh
pnpm install
pnpm build          # construye el registry (dist/r) y el CLI
```

## Storybook (web)

```sh
pnpm storybook      # http://localhost:6006
pnpm storybook:build
```

Los componentes de React Native se renderizan en el navegador con `react-native-web` (lo mismo que usa
Expo para web) y Uniwind aplica las clases. Por defecto se muestra en un viewport de **iPhone 15**;
desde la barra puedes cambiar a iPhone SE, Pixel 8 o iPad mini.

Los tokens (`@theme`) van en `apps/storybook/global.css`; deben ser los mismos que el `global.css` de la app.

## Usar el CLI en una app

Por ahora el registry se lee desde una ruta local (más adelante podrá ser un paquete npm privado).

```sh
# desde la app (ej. ../app-mobile)
node ../farma-system/packages/cli/dist/index.js init
node ../farma-system/packages/cli/dist/index.js list
node ../farma-system/packages/cli/dist/index.js add button
```

Tip: agrega en la app un script `"ds": "node ../farma-system/packages/cli/dist/index.js"` y usa `yarn ds add button`.

`init` crea `farma.json`:

```json
{
  "registry": "local:../farma-system/packages/registry/dist/r",
  "baseDir": "src/ds",
  "importAlias": "src/ds"
}
```

| Campo         | Qué hace                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| `registry`    | `local:<ruta a dist/r>` o `npm:<paquete>` (lee `node_modules/<paquete>/dist/r`)           |
| `baseDir`     | Carpeta donde se copian los archivos (mantiene `ui/`, `lib/`, `hooks/`, `theme/`)         |
| `importAlias` | Alias con el que la app importa `baseDir`; los imports `@farma/registry/*` se reescriben a él |

`add`:

1. Resuelve las `registryDependencies` del componente (recursivo, sin duplicados).
2. Copia los archivos reescribiendo `@farma/registry/...` → `<importAlias>/...`.
3. Si un archivo ya existe y cambió, pregunta antes de sobrescribir (`--overwrite` para forzar, `--yes` para omitir).
4. Instala las dependencias npm que falten con `npx expo install` (versiones compatibles con el SDK).
   Usa `--skip-install` para saltarlo.

## Agregar un componente al registry

1. Crea el código en `packages/registry/src/ui/<nombre>/<nombre>.tsx`.
   - Importa otros items con `@farma/registry/...` (ej. `import { cn } from '@farma/registry/lib/utils'`).
2. Crea su historia `packages/registry/src/ui/<nombre>/<nombre>.stories.tsx` (Storybook la detecta sola).
3. Regístralo en `packages/registry/registry.json`:

   ```json
   {
     "name": "button",
     "type": "ui",
     "description": "Botón principal",
     "files": [{ "path": "ui/button/button.tsx" }],
     "dependencies": ["tailwind-variants"],
     "registryDependencies": ["utils", "text", "spinner"]
   }
   ```

   Las historias no se listan en `files`, así no se copian a la app.
4. `pnpm registry:build` (valida el manifiesto y genera `dist/r/<nombre>.json`).

## Scripts

| Script                 | Descripción                                    |
| ---------------------- | ---------------------------------------------- |
| `pnpm build`           | Registry + CLI                                 |
| `pnpm registry:build`  | Solo el registry                               |
| `pnpm storybook`       | Storybook web en modo desarrollo               |
| `pnpm storybook:build` | Storybook estático en `apps/storybook/storybook-static` |
| `pnpm typecheck`       | TypeScript en todo el monorepo                 |
| `pnpm test`            | Tests del CLI (vitest)                         |
