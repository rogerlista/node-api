module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.js', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: 'v8',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
}
