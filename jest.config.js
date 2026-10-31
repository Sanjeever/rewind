export default {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/src/**/*.test.{js,ts,tsx}'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/|@react-native(?:-community)?/|(?:jest-)?react-native/)',
  ],
  cacheDirectory: '<rootDir>/.cache/jest',
  restoreMocks: true,
};
