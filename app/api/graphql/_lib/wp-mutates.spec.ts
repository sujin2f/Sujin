// yarn test page.spec.ts

import { VERSION } from '@common/constants/helper'
import { clearMongo } from '@common/.jest/helpers'
import { COLLECTION, T_Page } from '@app/_lib/types'
import migration from '@app/_lib/migration'
import Cached from '@common/model/Cached'
import {
    closeConnection,
    getCollection,
    migrate,
} from '@common/data/mongo/mongo'
import { mutatePage } from './wp-mutates'

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
})
