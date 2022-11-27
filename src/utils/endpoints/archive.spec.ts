// yarn test archive.spec.ts

import { term } from '../../__tests__/fixture'
import { TermTypes } from 'src/types/wordpress'
import { archive } from './archive'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('archive.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('archive', async () => {
        query.mockResolvedValueOnce([term])

        const result = await archive({
            type: TermTypes.category,
            slug: 'term',
            page: 1,
        })

        expect(result.title).toBe('Uncategorized')
    })

    it('archive: No Term', async () => {
        await archive({
            type: TermTypes.category,
            slug: 'term',
            page: 1,
        })
            .then(() => expect(true).toBeFalsy())
            .catch(() => expect(true).toBeTruthy())
    })
})
