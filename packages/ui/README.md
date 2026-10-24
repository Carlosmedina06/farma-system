# @carlosmedina06/farma-ui

Design system de Farma para **React Native + Expo + Uniwind**. Cada componente es un entry propio,
así Metro solo empaqueta lo que importás.

```sh
yarn add @carlosmedina06/farma-ui
# dependencias nativas (las que ya tenga tu app se reutilizan)
npx expo install react-native-reanimated react-native-worklets react-native-svg react-native-safe-area-context \
  react-native-gesture-handler expo-font expo-image expo-linear-gradient lottie-react-native
```

## Configuración (una vez)

```css
/* global.css (en la raíz de la app) */
@import 'tailwindcss';
@import 'uniwind';
@import '@carlosmedina06/farma-ui/theme.css';
@source './node_modules/@carlosmedina06/farma-ui/lib';
```

```tsx
import { useFarmaFonts } from '@carlosmedina06/farma-ui/fonts'
import { ModalHost } from '@carlosmedina06/farma-ui/modal'
import { PortalHost } from '@carlosmedina06/farma-ui/portal'
import { ToastHost } from '@carlosmedina06/farma-ui/toast'

export function App() {
  const [fontsLoaded] = useFarmaFonts()
  if (!fontsLoaded) return null

  return (
    <>
      <Navigation />
      <PortalHost />
      <ModalHost />
      <ToastHost topOffset={100} />
    </>
  )
}
```

En Jest, agregá el paquete a `transformIgnorePatterns`: `node_modules/(?!(…|@carlosmedina06/farma-ui))`.

## Uso

```tsx
import { Button } from '@carlosmedina06/farma-ui/button'
import { Icon } from '@carlosmedina06/farma-ui/icon'
import { Text } from '@carlosmedina06/farma-ui/text'
import { toast, ToastType } from '@carlosmedina06/farma-ui/toast'
import Identidad from '@carlosmedina06/farma-ui/illustrations/kyc/Identidad'

<Text type="h2">Hola</Text>
<Icon name="check" size={24} />
<Icon name="misc-visa-card" size={32} />
<Button onPress={() => toast.show({ text: 'Guardado', type: ToastType.Success })}>Guardar</Button>
```

| Import | Contenido |
| --- | --- |
| `@carlosmedina06/farma-ui/<componente>` | `button`, `text`, `icon`, `input`, `modal`, `toast`, `bottom-sheet`… |
| `@carlosmedina06/farma-ui/utils` · `tokens` · `fonts` · `store` · `dimensions` | utilidades |
| `@carlosmedina06/farma-ui/illustrations/<grupo>/<Nombre>` | ilustraciones (componentes SVG) |
| `@carlosmedina06/farma-ui/icons/svg/<Nombre>` · `icons/misc/<Nombre>` | íconos SVG |
| `@carlosmedina06/farma-ui/animations/<archivo>.json` | animaciones Lottie |
| `@carlosmedina06/farma-ui/theme.css` | tokens de Uniwind / Tailwind |

Los sistemas globales (modal, toast, option-modal, feedback-screen) funcionan como componentes controlados
(`visible` / `onClose`) o con su Host + API imperativa (`modal.show()`, `toast.show()`), sin provider global.

Catálogo y ejemplos: Storybook del repo ([farma-system](https://github.com/Carlosmedina06/farma-system)).

## Licencias

- Código, íconos, ilustraciones y marcas: todos los derechos reservados (`UNLICENSED`).
- Fuentes Inter y Manrope: SIL Open Font License 1.1 (`assets/fonts/*-OFL.txt`).
