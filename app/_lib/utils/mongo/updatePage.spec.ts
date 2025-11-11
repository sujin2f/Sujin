// yarn test updatePage.spec.ts

// import { select } from '../../../..common/data/mysql'
import { VERSION } from '@sujin/common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { COLLECTION, T_Page } from '@app/_lib/types'
import migration from '@app/_lib/migration'
import Cached from '@sujin/common/model/Cached'
import {
    deleteOne,
    getCollection,
    migrate,
} from '@sujin/common/data/mongo/mongo'
import { updatePage } from './updatePage'

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const query = jest.fn(async (_: string): Promise<unknown[]> => [['']])
jest.mock('mysql2/promise', () => ({
    createConnection: () => ({
        query,
    }),
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
    })

    test('updatePage(): existing Mongo page', async () => {
        const post = await pageFactory()

        query.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'AND posts.post_type="page" AND posts.post_status="publish',
                )
            ) {
                return Promise.resolve([
                    [
                        {
                            ...post,
                            title: 'Changed',
                        },
                    ],
                ])
            }
            return Promise.resolve([[]])
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
        await deleteOne(COLLECTION.POST, { _id: post._id })

        query.mockImplementation((arg: string) => {
            if (
                arg.includes(
                    'AND posts.post_type="page" AND posts.post_status="publish',
                )
            ) {
                return Promise.resolve([
                    [
                        {
                            ...post,
                            title: 'Changed',
                        },
                    ],
                ])
            }
            return Promise.resolve([[]])
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
        query.mockResolvedValue([[]])
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
