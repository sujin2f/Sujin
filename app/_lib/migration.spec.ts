// yarn test migration.spec.ts

import { VERSION } from '@sujin/common/constants/helper'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { categoryFactory } from '@jest/helpers'
import migration from './migration'
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
import Cached from '@sujin/common/model/Cached'
import { getCachedArchive } from '@app/_lib/utils/mongo/getCachedArchive'
import { migrate } from '@sujin/common/data/mongo/mongo'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))
jest.mock('next/cache', () => ({
    unstable_cache: (fn: unknown) => fn,
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
    })

    test('Mongo.migration(): Check Validation Error', async () => {
        await migrate('0.0.0', VERSION, migration)
        await categoryFactory({ slug: 'blog' })
        const result = await getCachedArchive('blog', ARCHIVE.CATEGORY)
        expect(result).toBeTruthy()
    })
})
