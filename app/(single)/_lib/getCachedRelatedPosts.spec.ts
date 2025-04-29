// yarn test post.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { categoryFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedRelatedPosts } from './getCachedRelatedPosts'
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

    test('getCachedRelatedPosts()', async () => {
        const category = await categoryFactory()
        await postFactory({
            slug: 'test-post-1',
            date: new Date('1977-01-01'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('1977-01-02'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-01-03'),
        })
        await postFactory({
            slug: 'test-post-4',
            date: new Date('1977-01-04'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('1977-01-05'),
            archives: [category._id],
        })

        const result = await getCachedRelatedPosts('test-post-1')
        expect(result.list.map((post) => post.slug).sort()).toEqual(
            ['test-post-3', 'test-post-4', 'test-post-2', 'test-post-5'].sort(),
        )

        await postFactory({
            slug: 'test-post-6',
            date: new Date('1977-01-06'),
            archives: [category._id],
        })

        const result2 = await getCachedRelatedPosts('test-post-2')
        expect(result2.list.map((post) => post.slug).sort()).toEqual(
            ['test-post-6', 'test-post-1', 'test-post-4', 'test-post-5'].sort(),
        )
    })
})
