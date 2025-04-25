// yarn test migration.spec.ts

import { VERSION } from '@common/constants/helper'
import { clearMongo } from '@common/.jest/helpers'
import { categoryFactory } from '@jest/helpers'
import migration from './migration'
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { getCachedArchive } from './data/mongo/wordpress/archive'
import { closeConnection, migrate } from '@common/data/mongo/mongo'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

describe('migration.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.ARCHIVE, COLLECTION.POST)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('Mongo.migration(): Check Validation Error', async () => {
        await migrate('0.0.0', VERSION, migration)
        await categoryFactory({ slug: 'blog' })
        const result = await getCachedArchive('blog', ARCHIVE.CATEGORY)
        expect(result).toBeTruthy()
    })
})
