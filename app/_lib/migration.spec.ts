// yarn test migration.spec.ts

import { VERSION } from '@common/constants/helper'
import { clearMongo } from '@jest/helpers'
import migration from './migration'
import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/types'
import Cached from '@common/model/Cached'
import { getCachedCategory } from './data/mongo/wordpress/category'

const mockQuery = jest.fn()
jest.mock('./data/mysql/term', () => ({
    getArchiveBySlug: () => mockQuery(),
}))

describe('migration.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo()
    })

    afterEach(async () => {
        Cached.getInstance().flush()
        await clearMongo(COLLECTION.CATEGORY, COLLECTION.POST)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo().then(async (client) => {
            await client.close()
        })
    })

    test('Mongo.migration(): Check Validation Error', async () => {
        mockQuery.mockImplementation(() => {
            return Promise.resolve({
                id: 1,
                title: 'Uncategorized',
                slug: 'blog',
                excerpt: '',
                image: {
                    mimeType: 'image/jpeg',
                    title: '463789214_8486095158174815_2317925829133014056_n',
                    url: '/wp-content/uploads/2025/04/463789214_8486095158174815_2317925829133014056_n.jpg',
                    width: 1,
                    height: 1,
                    sizes: {
                        medium: {
                            url: '/wp-content/uploads/2025/04/463789214_8486095158174815_2317925829133014056_n-225x300.jpg',
                            width: 225,
                            height: 300,
                            mimeType: 'image/jpeg',
                        },
                    },
                },
            })
        })
        await Mongo.insertOne(COLLECTION.CATEGORY, {
            id: 1,
            title: 'Uncategorized',
            slug: 'blog',
            excerpt: '',
            total: 16,
            hits: 300,
            image: {
                mimeType: 'image/jpeg',
                title: '463789214_8486095158174815_2317925829133014056_n',
                url: '/wp-content/uploads/2025/04/463789214_8486095158174815_2317925829133014056_n.jpg',
                sizes: [
                    {
                        key: 'medium',
                        file: '/wp-content/uploads/2025/04/463789214_8486095158174815_2317925829133014056_n-225x300.jpg',
                    },
                ],
            },
        })
        await Mongo.migrate('0.0.0', VERSION, migration)
        const result = await getCachedCategory('blog')
        expect(result).toBeTruthy()
    })
})
