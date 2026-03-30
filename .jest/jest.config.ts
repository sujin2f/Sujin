// testPathIgnorePatterns that nextJest overwrites caused wrong pattern matching
const config = {
    rootDir: '../',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    moduleNameMapper: {
        '^.+\\.module\\.(css|sass|scss)$': '<rootDir>/node_modules/next/dist/build/jest/object-proxy.js',
        '^.+\\.(css|sass|scss)$': '<rootDir>/node_modules/next/dist/build/jest/__mocks__/styleMock.js',
        '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|graphql)$':
            '<rootDir>/node_modules/next/dist/build/jest/__mocks__/fileMock.js',
        '^.+\\.(svg)$': '<rootDir>/.jest/svg-mock.js',
        '@next/font/(.*)': '<rootDir>/node_modules/next/dist/build/jest/__mocks__/nextFontMock.js',
        'next/font/(.*)': '<rootDir>/node_modules/next/dist/build/jest/__mocks__/nextFontMock.js',
        '^server-only$': '<rootDir>/node_modules/next/dist/build/jest/__mocks__/empty.js',

        '^@lib/(.*)$': '<rootDir>/lib/$1',
        '^@app/(.*)$': '<rootDir>/app/$1',
        '^@common-old/(.*)$': '<rootDir>/common-old/$1',
        '^@test/(.*)$': '<rootDir>/.jest/$1',
        '^@common/(.*)$': '<rootDir>/common/src/$1',
    },
    setupFiles: ['<rootDir>/.jest/setup.jest.js'],
    testEnvironment: 'jest-environment-jsdom',
    testMatch: [
        '<rootDir>/app/**/?(*.)+(spec|test).[tj]s?(x)',
        '<rootDir>/common-old/**/?(*.)+(spec|test).[tj]s?(x)',
        '<rootDir>/lib/**/?(*.)+(spec|test).[tj]s?(x)',
        '<rootDir>/.jest/**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': ['<rootDir>/node_modules/next/dist/build/swc/jest-transformer.js', [Object]],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!.pnpm)(?!(geist)/)',
        '/node_modules/.pnpm/(?!(geist)@)',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
    watchPathIgnorePatterns: ['/.next/'],
}

export default config
