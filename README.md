# farma-system

Design system de Farma para **React Native + Expo SDK 58 + Uniwind**, distribuido al estilo **shadcn/ui**:
en lugar de instalar una librería completa, un CLI copia a tu app **solo** los componentes que pides
(y sus dependencias). El código queda en tu proyecto y es tuyo.

## Estructura

```
apps/storybook       Storybook web (react-native-web + Vite + Uniwind) con viewports de móvil
packages/registry    Componentes (src/), ilustraciones, íconos, animaciones, fuentes, validación y build a dist/r
packages/cli         CLI `farma-system` (init, add, list)
packages/ui          Paquete npm @farma/ui, generado desde packages/registry (un import por componente)
```

## Principios

1. **Cero lógica de app.** Ningún componente conoce analytics, navegación, react-query, jotai, endpoints ni
   textos de negocio. Todo eso entra por props, callbacks o slots (`ReactNode`).
   `pnpm check` lo verifica: falla si un item importa `src/`, `@hooks/`, `@screens/`, `assets/`, un paquete
   no declarado, o un item que no está en sus `registryDependencies`.
2. **No hay `DSProvider`.** Ningún componente necesita un provider para renderizar.
3. **Primero el componente controlado, después el imperativo.** Los sistemas globales (modal, toast,
   option-modal, feedback-screen) son componentes controlados (`visible`/`onClose`) que funcionan solos.
   La API imperativa (`<XHost />` + `x.show()`) es una capa **opcional** e independiente por sistema,
   basada en un store mínimo (`lib/store`), sin jotai ni contexto.

### Composición en la app

La app monta solo los Hosts que usa, donde quiera:

```tsx
import { useFarmaFonts } from 'src/ds/lib/fonts'
import { UniwindGestureHandlerRootView } from 'src/ds/ui/gesture-root'
import { ShimmerSkeletonProvider } from 'src/ds/ui/shimmer-skeleton' // opcional: sincroniza los skeletons
import { ModalHost } from 'src/ds/ui/modal'
import { ToastHost } from 'src/ds/ui/toast'
import { PortalHost } from 'src/ds/ui/portal'

export function App() {
  const [fontsLoaded] = useFarmaFonts() // la app decide qué mostrar mientras cargan
  if (!fontsLoaded) return null

  return (
    <UniwindGestureHandlerRootView className="flex-1">
      <Navigation />
      <ModalHost />
      <PortalHost />
      <ToastHost topOffset={132} />
    </UniwindGestureHandlerRootView>
  )
}
```

```tsx
// En cualquier pantalla: imperativo (con Host)…
import { ToastType, toast } from 'src/ds/ui/toast'
toast.show({ text: 'Guardado', type: ToastType.Success })

// …o controlado (sin Host, sin estado global)
const [open, setOpen] = useState(false)
<Modal visible={open} close={() => setOpen(false)} title="¿Continuar?" />
```

| Sistema | Componente controlado | Capa opcional |
| --- | --- | --- |
| Toast | — | `ToastHost`, `toast.show/hide`, `showToast` |
| Modal | `Modal` (`visible`, `close`) | `ModalHost`, `modal.show/hide`, `useModal()` |
| Modal con opciones | `OptionModal` (`visible`, `selectedOption`, `onSelectOption`) | `OptionModalHost`, `optionModal.show`, `useOptionModal()` |
| Pantalla de resultado | `FeedbackScreen` (`visible`, `onClose`) | `FeedbackScreenHost`, `feedbackScreen.show`, `useFeedback()` |
| Portales | `Portal` (sin host renderiza en el lugar) | `PortalHost` |
| Snackbar | `Snackbar` (`open`, `onDismiss`) | — |
| Skeleton | `ShimmerSkeleton` (se anima solo) | `ShimmerSkeletonProvider` (sincroniza) |

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
desde la barra puedes cambiar a iPhone SE, Pixel 8 o iPad mini. Los sistemas globales tienen una story
**Sin Host** y otra **Con Host**.

Storybook importa el mismo theme que la app (`packages/registry/src/theme/farma.css`) y declara las fuentes
con `@font-face` (`apps/storybook/.storybook/fonts.css`).

## Usarlo como paquete npm (`@farma/ui`)

`packages/ui` se genera a partir del registry y se instala en la app como cualquier dependencia.
Cada componente tiene su propio import, así Metro solo empaqueta lo que la app usa:

```tsx
import { Button } from '@farma/ui/button'
import { Icon } from '@farma/ui/icon'
import { Modal, ModalHost, useModal } from '@farma/ui/modal'
import { toast, ToastHost, ToastType } from '@farma/ui/toast'
import { useFarmaFonts } from '@farma/ui/fonts'
import { cn } from '@farma/ui/utils'
import Identidad from '@farma/ui/illustrations/kyc/Identidad'   // ilustraciones: un archivo por import
import clock from '@farma/ui/animations/clock.json'                // animaciones Lottie
```

**Generar el paquete** (en farma-system):

```sh
pnpm ui:pack        # registry → packages/ui (lib + .d.ts) → packages/ui/dist/farma-ui.tgz
```

**Instalarlo en la app** (por ahora desde local; después desde el npm privado):

```sh
yarn add file:../farma-system/packages/ui/dist/farma-ui.tgz
```

Se instala desde el tarball (y no desde la carpeta) para que yarn copie solo `lib`, `assets` y `theme.css`,
igual que cuando se publique. Para actualizar: `pnpm ui:pack` y de nuevo el `yarn add`.

**Configurar la app (una vez):**

```css
/* global.css */
@import 'tailwindcss';
@import 'uniwind';
@import '@farma/ui/theme.css';            /* tokens del DS */
@source './node_modules/@farma/ui/lib';   /* relativo a global.css (en la raíz de la app): que Uniwind vea las clases del paquete */
```

```jsonc
// package.json → jest.transformIgnorePatterns: agregar @farma/ui a los paquetes que se transforman
"node_modules/(?!(…|uniwind|@farma/ui))"
```

Las dependencias nativas (reanimated, svg, lottie, expo-image…) son `peerDependencies`: usa las versiones
que ya tiene la app. Solo hacen falta las de los componentes que importes.

| Import | Qué trae |
| --- | --- |
| `@farma/ui/<componente>` | `button`, `modal`, `toast`, `icon`, `text`, `input`… (un entry por item de `farma-system list`) |
| `@farma/ui/utils`, `tokens`, `dimensions`, `fonts`, `store` | utilidades |
| `@farma/ui/illustrations/<grupo>/<Nombre>` | una ilustración (componente TSX) |
| `@farma/ui/icons/svg/<Nombre>` | un ícono SVG suelto |
| `@farma/ui/animations/<archivo>.json` | una animación Lottie |
| `@farma/ui/theme.css` | tokens de Uniwind/Tailwind |

## Instalarlo en la app (CLI, copiando el código)

La rama del design system es `main`. El CLI no se publica: copia el código al repo de la app. Los dos repos tienen que quedar como hermanos (`app-mobile` y `farma-system`).

**1. Dejar el comando `farma-system` disponible** (una vez, y `pnpm build` cada vez que cambie un componente):

```sh
cd farma-system
git checkout main
pnpm install
pnpm build
pnpm --filter @farma/cli link --global
```

**2. En la app, una sola vez.** `init` crea `farma.json`, copia `lib/utils` y abre un selector (espacio marca, enter confirma):

```sh
cd ../app-mobile
farma-system init
```

Si `farma-system` no está al lado de la app:

```sh
farma-system init -r local:../farma-system/packages/registry/dist/r
```

**3. Instalar cualquier componente por nombre.** El nombre es el de `list` (`button`, `modal`, `toast`, `snackbar`, `feedback-screen`…). Copia ese item y las dependencias del registry que le faltan (`button` trae `text`, `icon` y `spinner`).

```sh
farma-system list
farma-system add button
farma-system add modal
farma-system add toast snackbar feedback-screen
```

Después de `add theme` y `add fonts`, importá el theme en el `global.css` de la app y cargá las fuentes en el root (el ejemplo de composición está arriba):

```css
@import 'tailwindcss';
@import 'uniwind';
@import './src/ds/theme/farma.css';
```

```tsx
import { Button } from 'src/ds/ui/button'
import { Modal } from 'src/ds/ui/modal'
```

`init` crea `farma.json`:

```json
{
  "registry": "local:../farma-system/packages/registry/dist/r",
  "baseDir": "src/ds",
  "importAlias": "src/ds",
  "assetsDir": "assets/farma",
  "assetsAlias": "assets/farma"
}
```

| Campo         | Qué hace                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------- |
| `registry`    | `local:<ruta a dist/r>` o `npm:<paquete>` (lee `node_modules/<paquete>/dist/r`)           |
| `baseDir`     | Carpeta donde se copian los archivos (mantiene `ui/`, `lib/`, `theme/`)                    |
| `importAlias` | Alias con el que la app importa `baseDir`; los imports `@farma/registry/*` se reescriben a él |
| `assetsDir`   | Carpeta donde se copian fuentes y animaciones                                              |
| `assetsAlias` | Alias con el que la app importa `assetsDir`; `@farma/assets/*` se reescribe a él            |

`add`:

1. Resuelve las `registryDependencies` del componente (recursivo, sin duplicados).
2. Copia el código reescribiendo `@farma/registry/...` → `<importAlias>/...` y `@farma/assets/...` → `<assetsAlias>/...`,
   y los assets binarios (fuentes, lotties) a `assetsDir`.
3. Si un archivo ya existe y cambió, pregunta antes de sobrescribir (`--overwrite` para forzar, `--yes` para omitir).
4. Instala las dependencias npm que falten con `npx expo install` (versiones compatibles con el SDK).
   Usa `--skip-install` para saltarlo.

## Assets: solo lo que la app usa

Ilustraciones, íconos SVG sueltos y animaciones viven en el registry como **un item por asset**, así cada app
instala exactamente los que usa. Los **íconos** (`Icon`) vienen completos: los 1230 glifos de la fuente farmaIcons
y los 61 SVG `misc-*`, con las mismas claves que app-mobile (`<Icon name="misc-card-shied-incentive" />`).

```sh
farma-system list -t illustration            # o: list kyc · list -t icon · list -t animation
farma-system add illustration-kyc-identidad
farma-system add 'illustration-kyc-*' icon-visa animation-clock
```

- **Ilustraciones e íconos SVG** son componentes TSX (`react-native-svg`), generados con la misma configuración
  de SVGR que usa hoy la app: no necesitan `react-native-svg-transformer`.
- **Animaciones** se copian a `assetsDir` (`assets/farma/animations/`).
- **`Icon`** trae todos los glifos y todos los `misc-*`. Se pueden ver en Storybook: **Fundamentos/Icon**
  (Catálogo, Fuente, Misc).

Para traer de la app lo que usa (reejecutable; no modifica la app):

```sh
pnpm --filter @farma/registry assets:import --app ../app-mobile   # ilustraciones, misc-* y animaciones
pnpm --filter @farma/registry icons:build                         # regenera la fuente de íconos
```

`icons:build` parte de `packages/registry/icons-src/farmaIcons.full.ttf`. Hoy genera la fuente completa
(`icons-src/config.json` → `"subset": false`). Con `"subset": true` la recorta a los glifos usados por el DS,
por la app y los de `icons-src/keep-backend.json`.
Para nombres que llegan de afuera (ej. notificaciones) usá `<Icon name={x} fallback="bell-03" />` o `isIconName(x)`.
En Storybook están las galerías **Assets/Íconos** (todos: glifos, misc-* y SVG sueltos), **Assets/Ilustraciones** y **Assets/Animaciones**.

## Agregar o migrar un componente

Ver [`packages/registry/MIGRATING.md`](packages/registry/MIGRATING.md). En resumen: una carpeta por item en
`packages/registry/src/ui/<nombre>/` con el código, `index.ts`, `registry-item.json`, su story y sus tests
(las stories y tests no se copian a la app). Después `pnpm --filter @farma/registry check`.

## Scripts

| Script                 | Descripción                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `pnpm build`           | Registry (valida + genera `dist/r`) + CLI                       |
| `pnpm ui:pack`         | Genera el paquete `@farma/ui` y su tarball en `packages/ui/dist` |
| `pnpm registry:build`  | Solo el registry                                                |
| `pnpm storybook`       | Storybook web en modo desarrollo                                |
| `pnpm storybook:build` | Storybook estático en `apps/storybook/storybook-static`         |
| `pnpm typecheck`       | TypeScript en todo el monorepo                                  |
| `pnpm test`            | Tests del CLI (vitest) y de los componentes (jest-expo)         |
| `pnpm --filter @farma/registry assets:import --app <app>` | Importa los SVG y animaciones que usa la app |
| `pnpm --filter @farma/registry icons:build [--app <app>]` | Regenera la fuente de íconos (completa o recortada según `icons-src/config.json`) |
