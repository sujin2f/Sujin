// yarn test background.spec.ts

import Cached from '@common/model/Cached'
import { VERSION } from '@common/constants/helper'
import { clearMongo, backgroundFactory } from '@jest/helpers'
import { getCachedBackgrounds } from './background'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import migration from '@app/_lib/migration'
import setSystemOption from '@app/_lib/data/mongo/admin/setSystemOption'
import { imageBlock } from '@jest/fixture'

const mockQuery = jest.fn()
jest.mock('../../mysql/media', () => ({
    getBackgrounds: () => mockQuery(),
}))

describe('background.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await Mongo.migrate('0.0.0', VERSION, migration)
        await setSystemOption('version', VERSION)
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.BACKGROUNDS)
        Cached.getInstance().flush()
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo().then(async (client) => {
            await client.close()
        })
    })

    test('getCachedBackgrounds(): empty result', async () => {
        mockQuery.mockImplementation(() => {
            return Promise.resolve([
                {
                    ...imageBlock,
                    title: 'test image',
                },
            ])
        })

        const result = await getCachedBackgrounds()
        expect(result[0].title).toEqual('test image')
    })

    test('getCachedBackgrounds()', async () => {
        await backgroundFactory()
        await backgroundFactory()
        await backgroundFactory()

        const result = await getCachedBackgrounds()
        expect(result.length).toEqual(3)
    })
})
