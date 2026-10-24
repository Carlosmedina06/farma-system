# Cómo migrar un componente de app-mobile al registry

Origen: `/Users/cmedina/Desktop/metafar/app-mobile/src/design/{sub-atomic,atoms,molecules}` (solo lectura, **no se modifica**).
Destino: `packages/registry/src/ui/<nombre-kebab>/`.

## Regla de oro: cero lógica de app
Un item del registry **no puede** conocer la app: nada de analytics (mixpanel, datadog), react-query, jotai,
navegación, remote config, endpoints, tipos de `src/api`, ni textos de negocio (receta, pedido, farmacia,
pago, dirección, entrega…). Todo eso se convierte en **props, callbacks o slots (`ReactNode`)**.
Se permiten textos genéricos de UI/accesibilidad en español como *default* sobreescribible por props
("Cerrar", "Buscar", "Volver", "Más opciones").

Si un componente necesita estado global (modal, toast…): primero un **componente controlado y puro**
(`visible`, `onClose`) que funcione sin nada más; la API imperativa (Host + `x.show()`) va en un archivo aparte
y es opcional (ver `lib/store`). Ningún componente puede requerir un provider para renderizar.

## Estructura de un item
```
src/ui/button/
├─ Button.tsx            # código (nombres de archivo como en app-mobile)
├─ Button.types.ts
├─ index.ts              # exports con nombre: export { Button } from './Button'
├─ registry-item.json    # metadata (rutas relativas a esta carpeta)
├─ Button.stories.tsx    # story (NO se lista en files)
└─ __tests__/Button.test.tsx  # tests portados (NO se listan en files)
```

`registry-item.json`:
```json
{
  "name": "button",
  "type": "ui",
  "description": "…",
  "files": [{ "path": "Button.tsx" }, { "path": "Button.types.ts" }, { "path": "index.ts" }],
  "dependencies": ["tailwind-variants"],
  "registryDependencies": ["utils", "text", "icon", "spinner"]
}
```
Assets (lottie/fuentes): `{ "path": "lottie/x.json", "type": "asset" }` → archivo en `packages/registry/assets/`
(cópialo desde `app-mobile/assets` si no está) e impórtalo como `import x from '@farma/assets/lottie/x.json'`.

## Imports
| En app-mobile | En el registry |
|---|---|
| `@utils/styling/cn` | `@farma/registry/lib/utils` (`cn`) |
| `src/constants/accessibility` | `@farma/registry/lib/tokens` (`TOUCH_HIT_SLOP`, `MIN_TOUCH_TARGET_SIZE`) |
| `@utils/styling/shadowStyles` | `@farma/registry/lib/tokens` (`shadowCard`, `shadowTop`, `shadowBottom`) |
| `@utils/ui/dimensions` | `@farma/registry/lib/dimensions` (`getWP`, `getHP`) |
| `src/design/sub-atomic/Text/Text` | `import { Text } from '@farma/registry/ui/text'` |
| `src/design/sub-atomic/Icon/Icon`, `FarmaIcons` | `import { Icon, type IconName } from '@farma/registry/ui/icon'` |
| `atoms/UniwindLinearGradient` etc. | `@farma/registry/ui/linear-gradient`, `uniwind-image`, `safe-area-view`, `gesture-root` |
| `atoms/Spinner` / `ShimmerSkeleton` / `molecules/AnimatedLayout` | `@farma/registry/ui/spinner` / `shimmer-skeleton` / `animated-layout` |
| `react-native-paper` `Portal`, `molecules/OverlayPortal` | `@farma/registry/ui/portal` / `overlay-portal` |
| SVG `assets/svg/...svg` | convertir a componente TSX con `react-native-svg` dentro del item |
| `lodash` | código nativo (no usar lodash) |
| `react-native-shadow-2` | `shadowCard.*` de `lib/tokens` en `style`, o clase `shadow-card` |
| `jotai` | `createStore` / `useStore` de `@farma/registry/lib/store` (solo en capas imperativas) |

- Entre items: **siempre** `@farma/registry/...` y declarar el item en `registryDependencies`.
- Dentro del mismo item: imports relativos.
- Paquetes npm: declararlos en `dependencies` (excepto `react`, `react-native`, `uniwind`).
- Las stories y tests pueden importar con rutas relativas a otros items (no se validan).

## Tests
Porta los `__tests__` del origen a `__tests__/` del item: cambia los `jest.mock('@utils/styling/cn')` por
`jest.mock('@farma/registry/lib/utils')`, rutas `src/design/...` por `@farma/registry/...`, y ajusta a la nueva API.
Borra los casos que prueban lógica de app eliminada. `lottie-react-native` y reanimated ya están mockeados globalmente.

## Story
`<Componente>.stories.tsx` con `Meta`/`StoryObj` de `@storybook/react-native-web-vite`.
Títulos: `Fundamentos/…`, `Átomos/…`, `Moléculas/…`, `Globales/…`. Mira `src/ui/text/Text.stories.tsx`.

## Verificación (desde `packages/registry`)
```sh
pnpm check                         # frontera de imports + schema (no escribe dist)
npx jest src/ui/<item>             # tests del item
npx tsc -p tsconfig.json --noEmit 2>&1 | grep 'src/ui/<item>'   # typecheck del item
```
