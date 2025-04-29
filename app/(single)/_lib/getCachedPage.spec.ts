// yarn test page.spec.ts

import { VERSION } from '@common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { COLLECTION } from '@app/_lib/types'
import migration from '@app/_lib/migration'
import Cached from '@common/model/Cached'
import { closeConnection, migrate } from '@common/data/mongo/mongo'
import { getCachedPage } from './getCachedPage'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('page.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.PAGE)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('getCachedPage()', async () => {
        mockQuery.mockResolvedValue([])

        const post1 = await pageFactory()
        const post2 = await pageFactory()

        const result1 = await getCachedPage(post1.slug)
        expect(result1.id).toEqual(post1.id)

        const result2 = await getCachedPage(post2.slug)
        expect(result2.id).toEqual(post2.id)
    })
})
