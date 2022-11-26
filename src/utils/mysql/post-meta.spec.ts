// yarn test post-meta.spec.ts

import { mediaMeta } from '../../__tests__/fixture'
import { getAllPostMeta, getPostMeta } from './post-meta'

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

describe('post-meta.ts', () => {
    it('getAllPostMeta', async () => {
        query.mockResolvedValueOnce([mediaMeta])

        const result = await getAllPostMeta(1)

        expect(result[mediaMeta.meta_key]).toBe(mediaMeta.meta_value)
    })

    it('getPostMeta', async () => {
        query.mockResolvedValueOnce([mediaMeta])

        const result = await getPostMeta<Record<string, number>>(
            1,
            mediaMeta.meta_key,
            {},
        )

        expect(result.width).toBe(1024)
    })
})
