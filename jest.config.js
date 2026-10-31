export default {
  preset: '@react-native/jest-preset',
  testMatch: ['<rootDir>/src/**/*.test.cjs'],
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/|@react-native(?:-community)?/|(?:jest-)?react-native/)',
  ],
  cacheDirectory: '<rootDir>/.cache/jest',
  restoreMocks: true,
};
