// yarn test post-meta.spec.ts

import { mediaMeta } from '../../__tests__/fixture'
import { getAllPostMeta, getPostMeta } from './post-meta'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('post-meta.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

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
