import '@testing-library/jest-dom'
jest.mock('@sujin/share/model/Logger', () => ({
    Logger: {
        error: jest.fn(),
    },
}))
