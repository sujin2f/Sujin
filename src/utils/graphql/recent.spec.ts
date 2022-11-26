// yarn test recent.spec.ts

import { recent } from './recent'

jest.mock('src/utils/node-cache', () => ({
    cached: {
        get: jest.fn(),
        set: jest.fn(),
    },
}))
const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('recent.ts', () => {
    it('recent', async () => {
        const result = await recent()
        expect(result).toStrictEqual([])
    })
})
