// yarn test term.spec.ts

import { getArchiveBySlug } from './term'
import { ARCHIVE } from '@app/_lib/data/types'

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
        mockQuery.mockResolvedValue([
            {
                id: 1,
                name: 'Test',
                slug: 'test',
                type: 'category',
            },
        ])
        await getArchiveBySlug('test', ARCHIVE.CATEGORY)

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
})
