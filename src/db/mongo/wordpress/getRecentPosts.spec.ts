// yarn test getRecentPosts.spec.ts

import client from '@common/data/mongo/mongo-client'
import getRecentPosts from './getRecentPosts'
import Mongo from '@common/data/mongo/mongo'
import { post } from '../../../../.jest/fixture'

describe('getRecentPosts.ts', () => {
    afterAll(async () => {})

    test('getRecentPosts()', async () => {
        const post1 = {
            ...post,
            id: 21,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 210000000,
        }
        const post2 = {
            ...post,
            id: 22,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 220000000,
        }
        const post3 = {
            ...post,
            id: 23,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 230000000,
        }
        const post4 = {
            ...post,
            id: 24,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 240000000,
        }
        const post5 = {
            ...post,
            id: 25,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 250000000,
        }
        const post6 = {
            ...post,
            id: 26,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 260000000,
        }
        await Mongo.insertMany('post', [
            post1,
            post2,
            post3,
            post4,
            post5,
            post6,
        ])
        const result = (await getRecentPosts()).map((post) => post.id)
        expect(result).toEqual([26, 25, 24, 23, 22, 21])

        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('post').drop()
            } catch {}

            await client.close()
        })
    })
})
