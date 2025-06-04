module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
  testEnvironment: 'jsdom', // Pour les tests React
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testMatch: [
    "**/tests/**/*.test.[jt]s?(x)"
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};