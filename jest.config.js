module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        '<rootDir>/src/common/**/?(*.)+(spec).ts?(x)',
        '<rootDir>/src/utils/**/?(*.)+(spec).ts?(x)',
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        'src/assets/(.*)': '<rootDir>/src/assets/$1',
        'src/frontend/(.*)': '<rootDir>/src/frontend/$1',
        'src/constants/(.*)': '<rootDir>/src/constants/$1',
        'src/server/(.*)': '<rootDir>/src/server/$1',
        'src/types/(.*)': '<rootDir>/src/types/$1',
        'src/utils/(.*)': '<rootDir>/src/utils/$1',
        'src/common/(.*)': '<rootDir>/src/common/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/common/**/*.{ts,tsx}',
        '<rootDir>/src/utils/**/*.{ts,tsx}',
        '!<rootDir>/src/**/*.spec.{ts,tsx}',
        '!<rootDir>/src/**/*.d.{ts,tsx}',
        '!<rootDir>/src/__tests__/*',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    verbose: true,
}
