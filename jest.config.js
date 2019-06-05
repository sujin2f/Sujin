module.exports = {
  verbose: true,
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/app/$1',
  },
  moduleFileExtensions: [
    'js', 'json', 'jsx', 'ts', 'tsx', 'node',
  ],
  moduleDirectories: ['node_modules', 'app'],
  globals: {
    'wp': {},
  },
  collectCoverageFrom: [
    'app/**',
  ],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/logs",
  coverageReporters: ["clover"],
  testPathIgnorePatterns: ['/node_modules/', '/vendor/'],
  setupFiles: ['<rootDir>/tests/jest/global.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
};
