// yarn test tag-cloud.spec.ts

import { tagCloud } from './tag-cloud'

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

describe('tag-cloud.ts', () => {
    it('tag-cloud', async () => {
        const result = await tagCloud()
        expect(result).toStrictEqual([])
    })
})
