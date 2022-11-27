// yarn test recent.spec.ts

import { recent } from './recent'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('recent.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('recent', async () => {
        const result = await recent()
        expect(result).toStrictEqual([])
    })
})
