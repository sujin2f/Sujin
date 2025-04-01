// yarn test getPost.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import { post } from '../../../../.jest/fixture'
import getPost from './getPost'
import Mongo from '@common/data/mongo/mongo'

describe('getPost.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo('post')
    })

    afterAll(async () => {
        await clearMongo('post').then((client) => {
            client.close()
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
            type: 'post',
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
        const result1 = await getPost('test1')
        expect(result1.id).toEqual(1)

        const result2 = await getPost('test2')
        expect(result2.id).toEqual(2)

        const result3 = await getPost('test3')
        expect(result3.id).toEqual(3)
    })
})
