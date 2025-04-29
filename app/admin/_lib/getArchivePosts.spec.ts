// yarn test post.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { categoryFactory, tagFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getArchivePosts } from './getArchivePosts'
import Cached from '@common/model/Cached'
import { COLLECTION } from '@app/_lib/types'
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

describe('post.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.POST, COLLECTION.ARCHIVE)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo(COLLECTION.POST, COLLECTION.ARCHIVE)
        await clearMongo()
        await closeConnection()
    })

    test('getArchivePosts()', async () => {
        const category = await categoryFactory()
        const tag = await tagFactory()
        await postFactory({
            slug: 'test-post-1',
            archives: [category._id, tag._id],
        })
        await postFactory({
            slug: 'test-post-2',
            archives: [category._id],
        })
        await postFactory()

        const result1 = await getArchivePosts(category._id, 1)
        expect(result1.length).toEqual(2)
        const result2 = await getArchivePosts(tag._id, 1)
        expect(result2.length).toEqual(1)
    })
})
