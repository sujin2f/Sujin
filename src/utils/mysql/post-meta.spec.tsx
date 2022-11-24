// yarn test post-meta.spec.ts

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
        query.mockResolvedValueOnce([
            {
                meta_key: 'meta_key',
                meta_value: 'meta_value',
            },
        ])

        const result = await getAllPostMeta(1)

        expect(result.meta_key).toBe('meta_value')
    })

    it('getPostMeta', async () => {
        query.mockResolvedValueOnce([
            {
                meta_key: 'meta_key',
                meta_value: 'meta_value',
            },
        ])

        const result = await getPostMeta<string>(1, 'meta_key', '')

        expect(result).toBe('meta_value')
    })
})
