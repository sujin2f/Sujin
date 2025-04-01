// yarn test getRelatedPosts.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import getRelatedPosts from './getRelatedPosts'
import Mongo from '@common/data/mongo/mongo'
import { post } from '../../../../.jest/fixture'

describe('getRelatedPosts.ts', () => {
    beforeAll(async () => {
        await clearMongo('post')
    })

    afterAll(async () => {
        await clearMongo('post').then((client) => {
            client.close()
        })
    })

    test('getRelatedPosts()', async () => {
        const post1 = {
            ...post,
            id: 11,
            categories: [{ id: 1, name: 'Test', slug: 'test2' }],
            date: 11,
        }
        const post2 = {
            ...post,
            id: 12,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 12,
        }
        const post3 = {
            ...post,
            id: 13,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 13,
        }
        const post4 = {
            ...post,
            id: 14,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 14,
        }
        const post5 = {
            ...post,
            id: 15,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 15,
        }
        const post6 = {
            ...post,
            id: 16,
            categories: [{ id: 1, name: 'Test', slug: 'test' }],
            date: 16,
        }
        await Mongo.insertMany('post', [
            post1,
            post2,
            post3,
            post4,
            post5,
            post6,
        ])
        const result1 = (await getRelatedPosts(14, 'test', 'test')).map(
            (post) => post.id,
        )
        expect(result1).toEqual([16, 15, 13, 12])

        const result2 = (await getRelatedPosts(11, 'test', 'test2')).map(
            (post) => post.id,
        )
        expect(result2).toEqual([16, 15, 14, 13])
    })
})
