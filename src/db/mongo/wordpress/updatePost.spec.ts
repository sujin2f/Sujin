// yarn test updatePost.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import updatePost from './updatePost'
import Mongo from '@common/data/mongo/mongo'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('updateTerm.ts', () => {
    beforeAll(async () => {
        await clearMongo('post')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('post').then((client) => {
            client.close()
        })
    })

    test('updateTerm()', async () => {
        const nonce = 'nonce'

        mockQuery
            .mockResolvedValue([
                {
                    id: 1,
                    title: 'Test',
                    slug: 'test',
                    type: 'post',
                    content: '',
                },
            ])
            .mockResolvedValueOnce([
                {
                    key: 'update_post_nonce',
                    option_value: 'nonce-test',
                },
            ])
        await updatePost(nonce, 'test', '', '')

        const post = await Mongo.findOne('post', { id: 1 })
        expect(post.title).toEqual('Test')
        expect(post.slug).toEqual('test')
    })
})
