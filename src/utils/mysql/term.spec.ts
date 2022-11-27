// yarn test term.spec.ts

import { term } from '../../__tests__/fixture'
import { TermTypes } from 'src/types/wordpress'
import { getTaxonomies, getTermBy } from './term'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('term.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('getTaxonomies', async () => {
        query.mockResolvedValueOnce([term])

        const result = await getTaxonomies(1)
        expect(result[0].type).toBe(term.type)
        expect(result[0].title).toBe(term.title)
    })

    it('getTermBy', async () => {
        query.mockResolvedValueOnce([
            {
                ...term,
                total: 20,
            },
        ])

        const result = await getTermBy(TermTypes.category, 'category', 0)
        expect(result!.type).toBe(term.type)
        expect(result!.title).toBe(term.title)
        expect(result!.pages).toBe(2)
    })

    it('getTermBy: Nothing', async () => {
        const result = await getTermBy(TermTypes.category, 'category', 0)
        expect(result).toBe(undefined)
    })
})
