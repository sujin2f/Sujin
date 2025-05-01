// yarn test getCachedArchive.spec.ts

import { VERSION } from '@common/constants/helper'
import { categoryFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'
import migration from '@app/_lib/migration'
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
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

describe('archive.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
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

    test('getCachedArchive()', async () => {
        const category = await categoryFactory()
        await postFactory({
            archives: [category._id],
        })
        const archive = await getCachedArchive(category.slug, ARCHIVE.CATEGORY)
        expect(archive!._id.toString()).toEqual(category._id.toString())
    })
})
