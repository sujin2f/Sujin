// yarn test getPrevNext.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import { post } from '../../../../.jest/fixture'
import getPrevNext from './getPrevNext'
import Mongo from '@common/data/mongo/mongo'

describe('getPrevNext.spec.ts', () => {
    beforeAll(async () => {
        await clearMongo('post')
    })

    afterAll(async () => {
        await clearMongo('post').then((client) => {
            client.close()
        })
    })

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
    })
})
