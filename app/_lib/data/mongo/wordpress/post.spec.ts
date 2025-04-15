// yarn test post.spec.ts
//
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import {
    clearMongo,
    categoryFactory,
    tagFactory,
    postFactory,
} from '@jest/helpers'
import {
    getCachedPost,
    getArchivePosts,
    getCachedPrevNext,
    getCachedRecentPosts,
    getCachedRelatedPosts,
} from './post'
import Cached from '@common/model/Cached'
import { COLLECTION, POST_STATUS } from '@app/_lib/types'
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

    test('getCachedPrevNext()', async () => {
        const category = await categoryFactory()
        await postFactory({
            slug: 'test-post-1',
            title: 'test-post-1',
            date: new Date('2025-06-04') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('2025-06-05') as unknown as number,
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-06-06') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-4',
            title: 'test-post-4',
            date: new Date('2025-06-07') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('2025-06-08') as unknown as number,
            archives: [category._id],
        })

        const result1 = await getCachedPrevNext('test-post-3')
        expect(result1[0].title).toEqual('test-post-1')
        expect(result1[1].title).toEqual('test-post-4')
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

    test('getCachedRelatedPosts()', async () => {
        const category = await categoryFactory()
        await postFactory({
            slug: 'test-post-1',
            date: new Date('1977-01-01') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('1977-01-02') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-01-03') as unknown as number,
        })
        await postFactory({
            slug: 'test-post-4',
            date: new Date('1977-01-04') as unknown as number,
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('1977-01-05') as unknown as number,
            archives: [category._id],
        })

        const result = await getCachedRelatedPosts('test-post-1')
        expect(result.map((post) => post.slug)).toEqual([
            'test-post-3',
            'test-post-5',
            'test-post-4',
            'test-post-2',
        ])

        await postFactory({
            slug: 'test-post-6',
            date: new Date('1977-01-06') as unknown as number,
            archives: [category._id],
        })

        const result2 = await getCachedRelatedPosts('test-post-2')
        expect(result2.map((post) => post.slug)).toEqual([
            'test-post-6',
            'test-post-5',
            'test-post-4',
            'test-post-1',
        ])
    })
})
