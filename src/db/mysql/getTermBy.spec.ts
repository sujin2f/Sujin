// yarn test getTermBy.spec.ts

import { getTermBySlug, getTermById } from './getTermBy'
import { TermTypes } from '@src/constants/wordpress'

const mockQuery = jest.fn()

jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('getTermBy.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test('getTermBySlug()', async () => {
        const props = {
            type: TermTypes.category,
            slug: 'Test',
            page: 1,
        }
        mockQuery.mockResolvedValue([
            {
                id: 1,
                name: 'Test',
                slug: 'test',
                type: 'category',
            },
        ])
        await getTermBySlug(props)

        // if MySQL query is called the slug in lowercase
        expect(mockQuery).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining(`WHERE terms.slug=\"test\"`),
        )

        // if MySQL query is called for thumbnail
        expect(mockQuery).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining(
                `WHERE term_id=1 AND meta_key=\"thumbnail\"`,
            ),
        )
    })

    test('getTermById()', async () => {
        mockQuery.mockResolvedValue([
            {
                id: 1,
                name: 'Test',
                slug: 'test',
                type: 'category',
            },
        ])
        await getTermById(1)

        // if MySQL query is called with term_id
        expect(mockQuery).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining(`WHERE terms.term_id=\"1\"`),
        )

        // if MySQL query is called for thumbnail
        expect(mockQuery).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining(
                `WHERE term_id=1 AND meta_key=\"thumbnail\"`,
            ),
        )
    })
})
