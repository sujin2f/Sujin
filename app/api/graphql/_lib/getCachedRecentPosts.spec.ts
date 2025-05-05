// yarn test post.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedRecentPosts } from './getCachedRecentPosts'
import Cached from '@common/model/Cached'
import { COLLECTION } from '@app/_lib/types'
import { migrate } from '@common/data/mongo/mongo'

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
    })

    test('getCachedRecentPosts()', async () => {
        await postFactory()
        await postFactory()
        await postFactory()
        await postFactory()
        await postFactory()

        const result = await getCachedRecentPosts()
        expect(result.length).toEqual(5)
    })
})
