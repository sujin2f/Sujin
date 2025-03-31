// yarn test getPrevNext.spec.ts

import client from '@common/data/mongo/mongo-client'
import getPrevNext from './getPrevNext'
import Mongo from '@common/data/mongo/mongo'
import { post } from '../../../../.jest/fixture'

describe('getPrevNext.spec.ts', () => {
    afterAll(async () => {})

    test('getPrevNext.spec()', async () => {
        const post1 = {
            ...post,
            id: 1,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 1000,
        }
        const post2 = {
            ...post,
            id: 2,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 2000,
        }
        const post3 = {
            ...post,
            id: 3,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 3000,
        }
        const post4 = {
            ...post,
            id: 4,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 4000,
        }
        const post5 = {
            ...post,
            id: 5,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 5000,
        }
        const post6 = {
            ...post,
            id: 6,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 6000,
        }
        await Mongo.insertMany('post', [
            post1,
            post2,
            post3,
            post4,
            post5,
            post6,
        ])
        const result = (await getPrevNext(4, 4, 'test')).map((post) => post.id)
        expect(result).toEqual([2, 5])

        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('post').drop()
            } catch {}

            await client.close()
        })
    })
})
