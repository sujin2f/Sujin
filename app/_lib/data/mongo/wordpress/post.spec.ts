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
import { post } from '@jest/fixture'
import {
    getCachedPost,
    getCachedArchivePosts,
    getCachedPrevNext,
    getCachedRecentPosts,
    getCachedRelatedPosts,
    updateArchivePosts,
} from './post'
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
import { ARCHIVE, COLLECTION, POST_STATUS } from '@app/_lib/types'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(() => ({
        user: {
            email: process.env.ADMIN_EMAIL,
        },
    })),
}))

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('post.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await Mongo.migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.POST, COLLECTION.CATEGORY, COLLECTION.TAG)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo(COLLECTION.POST, COLLECTION.CATEGORY, COLLECTION.TAG)
        await clearMongo().then(async (client) => {
            await client.close()
        })
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

    test('getCachedArchivePosts()', async () => {
        const category = await categoryFactory()
        const tag = await tagFactory()
        await postFactory({
            slug: 'test-post-1',
            terms: [
                {
                    id: category.id,
                    title: category.title,
                    slug: category.slug,
                    type: ARCHIVE.CATEGORY,
                },
                {
                    id: tag.id,
                    title: tag.title,
                    slug: tag.slug,
                    type: ARCHIVE.TAG,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-2',
            terms: [
                {
                    id: category.id,
                    title: category.title,
                    slug: category.slug,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory()

        const result1 = await getCachedArchivePosts(
            ARCHIVE.CATEGORY,
            category.slug,
            1,
        )
        expect(result1.length).toEqual(2)
        const result2 = await getCachedArchivePosts(ARCHIVE.TAG, tag.slug, 1)
        expect(result2.length).toEqual(1)
        const result3 = await getCachedArchivePosts(
            ARCHIVE.CATEGORY,
            tag.slug,
            1,
        )
        expect(result3.length).toEqual(0)
    })

    test('getCachedPrevNext()', async () => {
        const category = await categoryFactory()
        await postFactory({
            slug: 'test-post-1',
            title: 'test-post-1',
            date: new Date('2025-06-04') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('2025-06-05') as unknown as number,
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-06-06') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-4',
            title: 'test-post-4',
            date: new Date('2025-06-07') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('2025-06-08') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
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
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('1977-01-02') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-01-03') as unknown as number,
        })
        await postFactory({
            slug: 'test-post-4',
            date: new Date('1977-01-04') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('1977-01-05') as unknown as number,
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
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
            terms: [
                {
                    ...category,
                    type: ARCHIVE.CATEGORY,
                },
            ],
        })

        const result2 = await getCachedRelatedPosts('test-post-2')
        expect(result2.map((post) => post.slug)).toEqual([
            'test-post-6',
            'test-post-5',
            'test-post-4',
            'test-post-1',
        ])
    })

    test('getMySQLArchivePosts()', async () => {
        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'WHERE terms.slug="test-post" AND posts.post_status="publish"',
                )
            ) {
                return Promise.resolve([
                    {
                        ...post,
                    },
                ])
            }

            if (arg.includes('taxonomy.taxonomy AS type')) {
                return Promise.resolve([
                    {
                        id: 5845,
                        title: '김조광수 생각',
                        slug: '%ea%b9%80%ec%a1%b0%ea%b4%91%ec%88%98-%ec%83%9d%ea%b0%81',
                        type: 'series',
                    },
                ])
            }

            return Promise.resolve([])
        })
        const result = await updateArchivePosts(
            ARCHIVE.CATEGORY,
            'test-post',
            1,
        )
        expect(result).toBeTruthy()
    })
})
