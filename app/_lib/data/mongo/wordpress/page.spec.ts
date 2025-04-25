// yarn test page.spec.ts

import { VERSION } from '@common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import {
    getCachedPage,
    mutatePage,
    removePage,
    updatePage,
    getPages,
} from './page'
import { COLLECTION, T_Page } from '@app/_lib/types'
import migration from '@app/_lib/migration'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import Cached from '@common/model/Cached'
import {
    closeConnection,
    getCollection,
    migrate,
} from '@common/data/mongo/mongo'

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
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('page.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await Cached.getInstance().flush()
        await clearMongo(COLLECTION.PAGE)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('getCachedPage()', async () => {
        mockQuery.mockResolvedValue([])

        const post1 = await pageFactory()
        const post2 = await pageFactory()

        const result1 = await getCachedPage(post1.slug)
        expect(result1.id).toEqual(post1.id)

        const result2 = await getCachedPage(post2.slug)
        expect(result2.id).toEqual(post2.id)
    })

    test('mutatePage()', async () => {
        const nonce = 'nonce'

        mockQuery.mockImplementation((arg: string) => {
            if (arg.includes('WHERE option_name="update_page_nonce"')) {
                return Promise.resolve([
                    {
                        key: 'update_page_nonce',
                        option_value: 'nonce-test',
                    },
                ])
            }
            if (arg.includes('FROM wp_posts AS posts')) {
                return Promise.resolve([
                    {
                        id: 1,
                        title: 'Test',
                        slug: 'test',
                        content: 'test',
                        date: new Date(),
                        status: 'publish',
                    },
                ])
            }
            return Promise.resolve([])
        })
        await mutatePage(nonce, 'test')

        const post = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({ id: 1 })
        expect(post!.title).toEqual('Test')
        expect(post!.slug).toEqual('test')
    })

    test('removePage()', async () => {
        const post = await pageFactory()
        await removePage(post.slug)
        const result = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({
            id: post.id,
        })
        expect(result).toBeFalsy()
    })

    test('removePage(): Nothing to remove, without throwing error', async () => {
        await removePage('none')
        const result = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({
            slug: 'none',
        })
        expect(result).toBeFalsy()
    })

    test('updatePage(): existing Mongo page', async () => {
        const post = await pageFactory()

        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'AND posts.post_type="page" AND posts.post_status="publish',
                )
            ) {
                return Promise.resolve([
                    {
                        ...post,
                        title: 'Changed',
                    },
                ])
            }
            return Promise.resolve([])
        })

        await updatePage(post.slug)
        const result = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({
            id: post.id,
        })
        expect(result?.title).toBe('Changed')
    })

    test('updatePage(): only from MySQL', async () => {
        const post = await pageFactory()
        await removePage(post.slug)

        mockQuery.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'AND posts.post_type="page" AND posts.post_status="publish',
                )
            ) {
                return Promise.resolve([
                    {
                        ...post,
                        title: 'Changed',
                    },
                ])
            }
            return Promise.resolve([])
        })

        await updatePage(post.slug)
        const result = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({
            id: post.id,
        })
        expect(result?.title).toBe('Changed')
    })

    test('updatePage(): does not exist', async () => {
        mockQuery.mockResolvedValue([])
        const result1 = await updatePage('slug').catch(() => 'caught!')
        const result2 = await (
            await getCollection<T_Page>(COLLECTION.PAGE)
        ).findOne({
            slug: 'slug',
        })

        expect(result1).toBe('caught!')
        expect(result2).toBeFalsy()
    })

    test('getPages()', async () => {
        for (let i = 0; i < PER_PAGE + 1; i++) {
            await pageFactory()
        }
        const result = await getPages(2)
        expect(result.length).toBe(1)
    })
})
