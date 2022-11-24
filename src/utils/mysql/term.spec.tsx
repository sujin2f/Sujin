// yarn test term.spec.ts

import { TermTypes } from 'src/types/wordpress'
import { getTaxonomies, getTermBy } from './term'

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

describe('term.ts', () => {
    it('getTaxonomies', async () => {
        query.mockResolvedValueOnce([
            {
                type: 'category',
                title: 'category',
            },
        ])

        const result = await getTaxonomies(1)
        expect(result[0].type).toBe('category')
        expect(result[0].title).toBe('category')
    })

    it('getTermBy', async () => {
        query.mockResolvedValueOnce([
            {
                type: 'category',
                title: 'category',
                total: 16,
            },
        ])

        const result = await getTermBy(TermTypes.category, 'category', 0)
        expect(result!.type).toBe('category')
        expect(result!.title).toBe('category')
        expect(result!.pages).toBe(2)
    })
})
