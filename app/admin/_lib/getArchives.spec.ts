// yarn test getArchives.spec.ts

import { VERSION } from '@common/constants/helper'
import { categoryFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getArchives } from './getArchives'
import migration from '@app/_lib/migration'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
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

describe('getArchives.spec.ts', () => {
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

    test('getArchives()', async () => {
        for (let i = 0; i < PER_PAGE + 1; i++) {
            await categoryFactory()
        }
        const result = await getArchives(ARCHIVE.CATEGORY, 2)
        expect(result.length).toBe(1)
    })
})
