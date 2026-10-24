/** Tests de los componentes del registry (no se copian a la app). */
module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.cjs'],
  moduleNameMapper: {
    '^@farma/registry/(.*)$': '<rootDir>/src/$1',
    '^@farma/assets/(.*)\\.json$': '<rootDir>/assets/$1.json',
    '^@farma/assets/(.*)$': '<rootDir>/jest/assetMock.cjs',
    '^react-native-worklets$': '<rootDir>/../../node_modules/react-native-worklets/lib/module/mock.js',
    '^react-native-reanimated$': '<rootDir>/jest/reanimatedMock.cjs',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-native-svg|uniwind|@shopify/.*|@react-native-vector-icons/.*))',
  ],
}
