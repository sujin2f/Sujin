// yarn test tag-cloud.spec.ts

import { MySQLQuery } from 'src/constants/mysql-query'
import { tagCloud } from '../../__tests__/fixture'
import { getTagCloud, updateHit } from './tag-cloud'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('tag-cloud.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('getTagCloud', async () => {
        query.mockResolvedValueOnce([tagCloud]).mockResolvedValueOnce([
            tagCloud,
            {
                ...tagCloud,
                id: 10,
                count: 30,
                hit: 30,
            },
        ])

        const result = await getTagCloud()

        expect(result).toStrictEqual([
            { id: 4, title: 'tag1', slug: 'tag1', count: 0, hit: 0 },
            { id: 10, title: 'tag1', slug: 'tag1', count: 3, hit: 3 },
        ])
    })

    it('updateHit', async () => {
        await updateHit(1)

        expect(query).toBeCalledWith(MySQLQuery.updateTagHit(1))
    })
})
