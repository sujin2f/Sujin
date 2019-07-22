module.exports = {
  verbose: true,
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/app/$1',
    '\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/tests/jest/__mocks__/fileMock.js',
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
  },
};
