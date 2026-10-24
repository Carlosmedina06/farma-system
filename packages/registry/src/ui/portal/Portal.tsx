import { Fragment, useEffect, useId, useLayoutEffect, type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { createStore, useStore } from '@farma/registry/lib/store'

type PortalState = {
  hosts: number
  entries: { key: string; node: ReactNode }[]
}

const portalStore = createStore<PortalState>({ hosts: 0, entries: [] })

/**
 * Punto donde se dibujan los `<Portal>`. Móntalo una vez, al final del root de la app,
 * para que su contenido quede por encima de todo lo demás.
 */
export function PortalHost() {
  const { entries } = useStore(portalStore)

  useEffect(() => {
    portalStore.set((state) => ({ ...state, hosts: state.hosts + 1 }))
    return () => portalStore.set((state) => ({ ...state, hosts: state.hosts - 1 }))
  }, [])

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {entries.map(({ key, node }) => (
        <Fragment key={key}>{node}</Fragment>
      ))}
    </View>
  )
}

/**
 * Renderiza `children` en el `PortalHost`. Si no hay ningún host montado,
 * los renderiza en el lugar: el componente nunca depende de un provider.
 */
export function Portal({ children }: { children: ReactNode }) {
  const key = useId()
  const { hosts } = useStore(portalStore)

  useLayoutEffect(() => {
    if (hosts === 0) return
    portalStore.set((state) => {
      const exists = state.entries.some((entry) => entry.key === key)
      return {
        ...state,
        entries: exists
          ? state.entries.map((entry) => (entry.key === key ? { key, node: children } : entry))
          : [...state.entries, { key, node: children }],
      }
    })
  }, [children, hosts, key])

  useLayoutEffect(
    () => () => portalStore.set((state) => ({ ...state, entries: state.entries.filter((entry) => entry.key !== key) })),
    [key],
  )

  return hosts === 0 ? <>{children}</> : null
}
