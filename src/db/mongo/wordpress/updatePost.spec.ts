// yarn test updatePost.spec.ts

import client from '@common/data/mongo/mongo-client'
import updatePost from './updatePost'
import Mongo from '@common/data/mongo/mongo'

const mockQuery = jest.fn()

jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('updateTerm.ts', () => {
    afterAll(async () => {
        jest.clearAllMocks()
        await client.then(async (client) => {
            const database = client.db(process.env.MONGO_DATABASE)
            try {
                await database.collection('post').drop()
            } catch {}
        })
    })

    test('updateTerm()', async () => {
        const nonce = 'nonce'

        mockQuery
            .mockResolvedValueOnce([
                {
                    key: 'update_post_nonce',
                    option_value: 'nonce-test',
                },
            ])
            .mockResolvedValueOnce('')
            .mockResolvedValueOnce([
                {
                    id: 1,
                    title: 'Test',
                    slug: 'test',
                    type: 'post',
                    content: '',
                },
            ])
            .mockResolvedValue([])
        await updatePost(nonce, 'test', 1, '', '')

        const post = await Mongo.findOne('post', { id: 1 })
        expect(post.title).toEqual('Test')
        expect(post.slug).toEqual('test')
    })
})
