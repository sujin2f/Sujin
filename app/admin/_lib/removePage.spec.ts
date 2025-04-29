// yarn test removePage.spec.ts

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

describe('removePage.spec.ts', () => {
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
})
