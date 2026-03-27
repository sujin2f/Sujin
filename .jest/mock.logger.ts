import '@testing-library/jest-dom'
jest.mock('@common/model/Logger', () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}))
