module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  verbose: true,
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
}
