// yarn test migration.spec.ts

import { VERSION } from '@common/constants/helper'
import { categoryFactory, clearMongo } from '@jest/helpers'
import migration from './migration'
import Mongo from '@common/data/mongo/mongo'
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import {
    categoryFormatter,
    getCachedArchive,
} from './data/mongo/wordpress/archive'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(() => ({
        user: {
            email: process.env.ADMIN_EMAIL,
        },
    })),
}))

describe('migration.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.CATEGORY, COLLECTION.POST)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo().then(async (client) => {
            await client.close()
        })
    })

    test('Mongo.migration(): Check Validation Error', async () => {
        await Mongo.migrate('0.0.0', VERSION, migration)
        await categoryFactory({ slug: 'blog' })
        const result = await getCachedArchive(
            'blog',
            ARCHIVE.CATEGORY,
            categoryFormatter,
        )
        expect(result).toBeTruthy()
    })
})
