// yarn test background.spec.ts

import Cached from '@common/model/Cached'
import { VERSION } from '@common/constants/helper'
import { clearMongo, backgroundFactory } from '@jest/helpers'
import { getCachedBackgrounds } from './background'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import migration from '@app/_lib/migration'
import setSystemOption from '@app/_lib/data/mongo/admin/setSystemOption'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
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
        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'WHERE terms.slug="background" AND posts.post_status="inherit"',
                )
            ) {
                return Promise.resolve([
                    { id: 1, title: 'test', mimeType: 'image' },
                ])
            }

            if (
                arg.includes(
                    'WHERE post_id="1" AND meta_key="_wp_attachment_metadata"',
                )
            ) {
                return Promise.resolve([{ meta_value: 'test' }])
            }
            return Promise.resolve([])
        })

        const result = await getCachedBackgrounds()
        expect(result[0].mimeType).toEqual('image')
    })

    test('getCachedBackgrounds()', async () => {
        await backgroundFactory()
        await backgroundFactory()
        await backgroundFactory()

        const result = await getCachedBackgrounds()
        expect(result.length).toEqual(3)
    })
})
