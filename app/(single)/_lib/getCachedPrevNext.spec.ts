// yarn test post.spec.ts
import { VERSION } from '@common/constants/helper'
import migration from '@app/_lib/migration'
import { categoryFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { getCachedPrevNext } from './getCachedPrevNext'
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

    test('getCachedPrevNext()', async () => {
        const category = await categoryFactory()
        await postFactory({
            slug: 'test-post-1',
            title: 'test-post-1',
            date: new Date('2025-06-04'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-2',
            date: new Date('2025-06-05'),
        })
        await postFactory({
            slug: 'test-post-3',
            date: new Date('2025-06-06'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-4',
            title: 'test-post-4',
            date: new Date('2025-06-07'),
            archives: [category._id],
        })
        await postFactory({
            slug: 'test-post-5',
            date: new Date('2025-06-08'),
            archives: [category._id],
        })

        const result1 = await getCachedPrevNext('test-post-3')
        expect(result1[0].title).toEqual('test-post-1')
        expect(result1[1].title).toEqual('test-post-4')
    })
})
