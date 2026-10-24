// Tipos para importar assets (fuentes e imágenes) con `import`.
// Metro devuelve un id de asset y Vite una URL; ambos sirven como `source`.
declare module '*.ttf' {
  const source: number | string
  export default source
}

declare module '*.otf' {
  const source: number | string
  export default source
}

declare module '*.png' {
  const source: number | string
  export default source
}
