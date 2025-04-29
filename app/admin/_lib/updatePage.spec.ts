// yarn test updatePage.spec.ts

import { VERSION } from '@common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { COLLECTION, T_Page } from '@app/_lib/types'
import migration from '@app/_lib/migration'
import Cached from '@common/model/Cached'
import {
    closeConnection,
    getCollection,
    migrate,
} from '@common/data/mongo/mongo'
import { updatePage } from './updatePage'
import { removePage } from './removePage'

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

describe('updatePage.spec.ts', () => {
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
})
