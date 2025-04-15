// yarn test background.spec.ts

import Cached from '@common/model/Cached'
import { VERSION } from '@common/constants/helper'
import { clearMongo, backgroundFactory } from '@jest/helpers'
import { getCachedBackgrounds } from './background'
import Mongo from '@common/data/mongo/mongo-deprecated'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'

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
jest.mock('../../mysql/media', () => ({
    getBackgrounds: () => mockQuery(),
}))

describe('background.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await Mongo.migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.BACKGROUNDS)
        await Cached.getInstance().flush()
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo().then(async (client) => {
            await client.close()
        })
    })

    test('getCachedBackgrounds(): empty result', async () => {
        const result = await getCachedBackgrounds()
        expect(result).toEqual([])
    })

    test('getCachedBackgrounds()', async () => {
        await backgroundFactory()
        await backgroundFactory()
        await backgroundFactory()

        const result = await getCachedBackgrounds()
        expect(result.length).toEqual(3)
    })
})
