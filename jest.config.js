module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
}
