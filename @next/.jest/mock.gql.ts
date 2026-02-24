import '@testing-library/jest-dom'
const mockQuery = jest.fn()
jest.mock('@app/_lib/graphql/client', () => ({
    client: {
        query: () => mockQuery,
    },
}))
