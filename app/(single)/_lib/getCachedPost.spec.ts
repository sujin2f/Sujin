// yarn test getCachedPost.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedPost } from './getCachedPost'
import Cached from '@common/model/Cached'
import { COLLECTION, POST_STATUS } from '@app/_lib/types'
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
jest.mock('next/cache', () => ({
    unstable_cache: (fn: unknown) => fn,
}))

describe('getCachedPost.spec.ts', () => {
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

    test('getCachedPost()', async () => {
        const post1 = await postFactory()
        const post2 = await postFactory()
        const post3 = await postFactory({
            status: POST_STATUS.DRAFT,
        })

        const result1 = await getCachedPost(post1.slug)
        expect(result1.id).toEqual(post1.id)
        const result2 = await getCachedPost(post2.slug)
        expect(result2.id).toEqual(post2.id)
        const result3 = await getCachedPost(post3.slug)
        expect(result3.id).toEqual(post3.id)
    })

    test('getCachedPost(): not exist', async () => {
        const result = await getCachedPost('slug').catch((e) => e.name)
        expect(result).toEqual('204 No Content')
    })
})
