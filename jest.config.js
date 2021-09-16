module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.js', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/__mocks__'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
}
