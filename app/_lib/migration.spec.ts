// yarn test migration.spec.ts

import { VERSION } from '@common/constants/helper'
import { categoryFactory, clearMongo } from '@jest/helpers'
import migration from './migration'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { getCachedCategory } from './data/mongo/wordpress/category'

jest.mock('./utils-server', () => ({
    isAdmin: jest.fn(() => true),
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
        const result = await getCachedCategory('blog')
        expect(result).toBeTruthy()
    })
})
