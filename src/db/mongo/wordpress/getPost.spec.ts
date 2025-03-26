// yarn test getPost.spec.ts

import client from '@common/data/mongo/mongo-client'
import getPost from './getPost'
import Mongo from '@common/data/mongo/mongo'
import { post } from '../../../../.jest/fixture'

describe('getPost.spec.ts', () => {
    afterAll(async () => {
        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('post').drop()
            } catch {}
        })
    })

    test('getPost.spec()', async () => {
        const post1 = {
            ...post,
            id: 1,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 1000,
            type: 'post',
            slug: 'test1',
        }
        const post2 = {
            ...post,
            id: 2,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 2000,
            type: 'page',
            slug: 'test2',
        }
        const post3 = {
            ...post,
            id: 3,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 3000,
            type: 'post',
            status: 'draft',
            slug: 'test3',
        }

        await Mongo.insertMany('post', [post1, post2, post3])
        const result1 = await getPost('test1', 'post')
        expect(result1.id).toEqual(1)

        const result2 = await getPost('test2', 'page')
        expect(result2.id).toEqual(2)

        const result3 = await getPost('test3', 'post', true)
        expect(result3.id).toEqual(3)
    })
})
