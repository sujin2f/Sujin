import '@testing-library/jest-dom'
export const redis = () => ({
    createClient: {
        connect: jest.fn(),
    },
})
