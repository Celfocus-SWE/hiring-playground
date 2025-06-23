module.exports = {
  displayName: 'Celfocus App',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      jsx: 'react-jsx',
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/libs/(.*)$': '<rootDir>/libs/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@app/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  testMatch: [
    '<rootDir>/specs/**/*.spec.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.spec.{ts,tsx,js,jsx}',
    '<rootDir>/libs/**/*.spec.{ts,tsx,js,jsx}',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx,js,jsx}',
    '<rootDir>/libs/**/*.{ts,tsx,js,jsx}',
    '!<rootDir>/src/**/*.d.ts',
    '!<rootDir>/libs/**/*.d.ts',
    '!<rootDir>/src/**/*.stories.{ts,tsx,js,jsx}',
    '!<rootDir>/libs/**/*.stories.{ts,tsx,js,jsx}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(next|@next|react|@react|@testing-library)/)',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      jsx: 'react-jsx',
    },
  },
}; 