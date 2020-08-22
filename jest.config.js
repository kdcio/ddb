module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/tests/__helpers'],
  collectCoverage: true,
  coverageReporters: ['lcov'],
  collectCoverageFrom: ['src/**/*.js'],
  watchPathIgnorePatterns: [
    '<rootDir>/node_nodules/',
    '<rootDir>/lib/',
    '<rootDir>/coverage/',
  ],
  globalSetup: `<rootDir>/tests/setup.js`,
  globalTeardown: `<rootDir>/tests/teardown.js`,
};
