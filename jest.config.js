module.exports = {
  verbose: true,
  collectCoverageFrom: [
    'tests/jest/**',
  ],
  moduleNameMapper: {
    'app/(.*)': '<rootDir>/app/$1',
  },
  moduleFileExtensions: [
    'js', 'json', 'jsx', 'ts', 'tsx', 'node',
  ],
  moduleDirectories: ['node_modules', 'app'],
  globals: {
    'wp': {},
  }
};
