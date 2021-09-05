module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.js'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/__mocks__'],
  testEnvironment: 'node',
}
