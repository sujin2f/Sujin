// yarn test tag-cloud.spec.ts

import { tagCloud } from './tag-cloud'

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
