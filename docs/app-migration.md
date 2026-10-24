# Migrar app-mobile a farma-system

Cambios de API entre `app-mobile/src/design` y los items del registry, para reemplazar imports en la app.
Regla general: los imports pasan a `src/ds/<ui|lib>/<item>` con **exports con nombre**
(`import { Text } from 'src/ds/ui/text'`, antes `import Text from 'src/design/sub-atomic/Text/Text'`).

## Root de la app (reemplaza `DSProvider`)

| Antes (`DSProvider`) | Ahora |
| --- | --- |
| `useFonts` interno, devolvía `null` hasta cargar | `useFarmaFonts()` (`lib/fonts`): la app decide qué mostrar |
| `UniwindGestureHandlerRootView` | `ui/gesture-root` |
| `ShimmerSkeletonProvider` | `ui/shimmer-skeleton` (opcional; sin él cada skeleton se anima solo) |
| `<Toast config={toastConfig} position="top" />` | `<ToastHost topOffset={Platform.OS === 'ios' ? 132 : 100} bottomOffset={getHP(32)} />` |
| `<ModalProvider />` | `<ModalHost />` |
| `<ModalWithOptionsProvider />` | `<OptionModalHost />` |
| `<FeedbackScreenProvider />` | `<FeedbackScreenHost />` (hoy no se usa en la app: se puede omitir) |
| `<SurveyCancelationModalProvider />` | se elimina (código muerto; la app tiene su propio flujo en `screens/Timeline/views/CancelationReasons`) |
| `Portal.Host` / `PaperProvider` de react-native-paper (BottomSheet, OverlayPortal) | `<PortalHost />` al final del root |

## Sistemas globales

- **Toast**: `showToast` existe igual (`ui/toast`); `SnackbarType` → `ToastType` (exportado desde `ui/toast`),
  `DefaultSucces` → `DefaultSuccess`. `ProductDeleted` no existe: usar `{ type: ToastType.Default, withIcon: true, withCloseIcon: true }`.
  `Toast.hide()` directo → `toast.hide()`.
- **Banner de conectividad** (`SnackbarLayout layout="connectivity"`) → `Snackbar` (`ui/snackbar`), controlado con `open`:
  `variant` `offline|recovered|error` → `neutral|success|error`; offline usa `entrance="fade"`.
- **Modal**: `useModal()` mantiene `{ showModal, hideModal }`. Quienes leían `currentModalAtom` → `useCurrentModal()` o `modal.current`.
  `isSurveyCancelation` eliminado.
- **ModalWithOptions** → `OptionModal` (`ui/option-modal`): `useModalWithOptions()` → `useOptionModal()` (misma forma).
  La opción "Otro" ya no se detecta por label: pasar `freeTextOption={{ value: '<value de Otro>', minLength: 10, maxLength: 150, errorText: 'Ingresá un mínimo de 10 caracteres' }}`.
- **FeedbackScreen**: `useFeedback()` igual. También existe `<FeedbackScreen visible onClose />` controlado.

## Átomos

| Componente | Cambio |
| --- | --- |
| Icon | tipo `IconName` (`FarmaIcons` queda como alias deprecado). La fuente solo trae los glifos usados: nombres que vienen del backend → `<Icon name={item.icon} fallback="bell-03" />` o `isIconName()`. Íconos `misc-*` → items `icon-*` (ver Assets) con `<SvgIcon icon={Visa} />` |
| Text | variantes `card-number` → `mono-lg`, `card-text` → `mono-sm` |
| Badge | sin `activePrescription`/`inactivePrescription`; tamaño `availablePrescription` → `wide`; nuevo `semibold`. Equivalentes: activa → `color="primary" className="text-primary-600" iconClassName="text-primary-600" semibold`; inactiva → `color="gray" className="bg-transparent text-gray-600" iconClassName="text-gray-600" semibold` |
| Button | `socialButton` ahora es un `type` real (colores a validar con diseño) |
| List (`ListBold`) | `showDeletedProducts` → `disabled` + `subtitle="Eliminado"`; `noCostLabel` → `footnote="Sin costo"`; `isNotification` → `descriptionClassName="w-[80%]"`; pasar `descriptionNumberOfLines={1}` para `file-check-02` / `message-dots-square` |
| OptimizedImage | sin placeholder por defecto: `fallbackSource={require('assets/png/Size=xl.png')}`; caché: `failedCache={{ has: isImageKnownFailed, add: markImageFailed }}` |
| CodeInput | `lenght` → `length`; `flowName` y mixpanel eliminados → callbacks `onMounted`, `onError`, `onAutofill`, `onComplete({ code, autofill, elapsedMs })` (la app llama a `trackEvent` desde ahí) |
| DropDownButton | `formatValue={capitalizeExcludingArticles}` para mantener el formato |
| EmailInput | nuevo `domains` (default gmail/hotmail/yahoo/outlook) |
| PhoneInput | nuevo `placeholder` |
| Toogle | → `Toggle` (`ui/toggle`) |
| BottomSheet | usa `Portal` propio: requiere `<PortalHost />` (sin host dibuja en el lugar) |

## Moléculas

| Componente | Cambio |
| --- | --- |
| ButtonSectionLayout | `formatAmount={formatCurrency}`; variantes: `verticalPrimaryWithLoginPrompt` → `verticalPrimaryWithLinkPrompt` (+ `promptText="¿Ya tenés cuenta?"`); `verticalTwoButtonsOrderEstimate` y `verticalTwoButtonsWithAmounOrderSummary` → `verticalTwoButtonsWithSummary`; `verticalSingleButtonWithAddress` → `verticalSingleButtonWithHeader` (`headerTitle`, `headerCaption`, `headerIcon="marker-pin-02"`); `productButton` → `actionSlotWithButton` con `renderAction={({ height }) => <ProductButton … />}` |
| ScreenLayout | sin re-export de `HeaderActionProps` |
| StepHeader | controlado: `steps={['Cotización','Pago']} activeStep={idx} onBack={…}`; el `StepAtom` pasa a la app |
| CustomScreenHeader | `showLogoHeader` → `logo={<LogoFarmatouch />}`; `showStepHeader` → `hideTopBar subHeader={<StepHeader … />}`; caso `notification-message` → `rightAction={<ChatIconWithAlert … />}` |
| Dropdown | `formatLabel={(s) => s === 'DNI' ? s : capitalizeExcludingArticles(s)}` |
| DetailCard | por item `noCost: label === 'Retiro en farmacia' && !additionalDescription`; dirección → `footer={<ListBold icon="marker-pin-01" … />}` |
| FileUploadOptionsSheet | → `ActionSheet` con `title`, `description` y `options` de la app; `testID="attach-recipe-file-options"` + keys `document`/`gallery`/`camera` mantienen los testIDs |
| Navbar | → `TabBar` con `icons={…}` y `badges={{ Notifications: hasNotifications }}` desde un wrapper de la app; `EnviromentIndicator` queda en la app |
| IncomingMessage / OutcomingMessage | → `ChatBubble`: `message` → `text`, `isMessageLink` → `isLink`, `writing` → `typing`; descarga (`useGetDownloadFile`), `ImagePreview` y `PdfViewer` quedan en la app vía `attachment`, `loading`, `onPressAttachment`, `renderAttachment`; `senderName="Operador"` |
| WritingMessage | → `TypingIndicator` |
| AttemptLimitModal | `onGoToLogin` → `onButtonPress`; `title` y `buttonText` obligatorios; `descriptionPrefix` + `remainingTime` → `description` |
| EmptyState | sin ilustración por defecto: `illustration={<EmptyResults />}` |
| SelectedFilesPanel | `processLabel="Procesar receta"` (default ahora "Continuar") |

## Assets (ilustraciones, íconos SVG, animaciones, fuente de íconos)

El DS trae **solo los assets que la app usa** (importados con `pnpm --filter @farma/registry assets:import --app ../app-mobile`).
`docs/assets-map.json` tiene, para cada ruta vieja o clave `misc-*`, el item a instalar, el import nuevo y los archivos de la app que lo usan.

| Antes | Ahora |
| --- | --- |
| `import X from 'assets/svg/illustrations/kyc/ilus-identidad.svg'` | `add illustration-kyc-identidad` → `import Identidad from 'src/ds/illustrations/kyc/Identidad'` |
| `<Icon name="misc-visa" />` | `add icon-visa` → `<SvgIcon icon={Visa} />` |
| `require('assets/lottie-animations/clock.json')` | `add animation-clock` → `require('assets/farma/animations/clock.json')` |
| `assets/fonts/FarmaIcons/*` (1230 glifos) | la fuente del DS (`fonts`) trae solo los glifos usados |

Con comodines: `farma-system add 'illustration-kyc-*' 'icon-*'`. Después de migrar se puede borrar de app-mobile:
`assets/svg/**`, `assets/lottie-animations/`, `assets/fonts/FarmaIcons/`, `src/design/_core/generated/misc-icons.ts`
y las devDependencies del generador de fuentes que ya no se usa (`svg2ttf`, `svgicons2svgfont`, `oslllo-svg-fixer`, `xml2js`).
`react-native-svg-transformer` se puede quitar cuando ningún `.svg` se importe directo.

No se migran (no usados): 2 ilustraciones (`EmptyOrder`, `ilus-catalogo-02`) y 22 misc-icons
(tarjetas `*-card`/`*-fill-card`, `cabal-icon`, `centraloeste`, `connection-icon`, `facebook`, `farmacity`, `farmaplus`,
`footer-m1..m5`, `lasante`, `openfarma`, `osecac`, `shopping-bag`, `user`, `notification-message`).

## Se quedan en la app (dominio)

TimelineCard, PaymentCard, PaymentRevertedNotice, DeliveryMethodCard, DefaultAddress, ReassignmentModal,
DisabledLocationModal, SurveyCancelationModal, ElectronicPrescriptionCard, EnviromentIndicator.
Se reconstruyen con primitivas del DS (Text, Icon, Badge, Button, ShimmerSkeleton, Modal…).

## Código muerto (no se migra; se puede borrar)

Header, Feedback, OptionCard (y variantes), Row, GenericKeyboard, TextAnalizer, OrderDetailsBottomSheet, PharmacyCard.

## Para revisar con diseño

- Colores de `Button type="socialButton"` (antes no era seleccionable).
- Badge rojo / contador de `TabBar` (estilo nuevo).
- Inputs: el resplandor de `react-native-shadow-2` se reemplazó por un anillo de 2px del mismo color.
