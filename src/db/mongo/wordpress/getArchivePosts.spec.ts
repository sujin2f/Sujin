// yarn test getArchivePosts.spec.ts

import client from '@common/data/mongo/mongo-client'
import getArchivePosts from './getArchivePosts'
import Mongo from '@common/data/mongo/mongo'
import { post } from '../../../../.jest/fixture'
import { TermTypes } from '@src/constants/wordpress'

describe('getArchivePosts.spec.ts', () => {
    afterAll(async () => {})
    test('getArchivePosts.spec()', async () => {
        const post1 = {
            ...post,
            id: 31,
            categories: [{ id: 1, name: 'Test', slug: 'exclude' }],
            date: 31,
        }
        const post2 = {
            ...post,
            id: 32,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 32,
        }
        const post3 = {
            ...post,
            id: 33,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 33,
        }
        const post4 = {
            ...post,
            id: 34,
            categories: [{ id: 1, name: 'Test', slug: 'exclude' }],
            date: 34,
        }
        const post5 = {
            ...post,
            id: 35,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 35,
        }
        const post6 = {
            ...post,
            id: 36,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 36,
        }
        await Mongo.insertMany('post', [
            post1,
            post2,
            post3,
            post4,
            post5,
            post6,
        ])

        const result = (
            await getArchivePosts(TermTypes.category, 'test', 1)
        ).map((post) => post.id)
        expect(result).toEqual([36, 35, 33, 32])

        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('post').drop()
            } catch {}

            await client.close()
        })
    })
})
