// yarn test updatePage.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import updatePage from './updatePage'
import Mongo from '@common/data/mongo/mongo'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('updatePage.ts', () => {
    beforeAll(async () => {
        await clearMongo('page')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('page').then((client) => {
            client.close()
        })
    })

    test('updatePage()', async () => {
        const nonce = 'nonce'

        mockQuery
            .mockResolvedValue([
                {
                    id: 1,
                    title: 'Test',
                    slug: 'test',
                    type: 'page',
                    content: '',
                },
            ])
            .mockResolvedValueOnce([
                {
                    key: 'update_post_nonce',
                    option_value: 'nonce-test',
                },
            ])
        await updatePage(nonce, 'test')

        const post = await Mongo.findOne('page', { id: 1 })
        expect(post.title).toEqual('Test')
        expect(post.slug).toEqual('test')
    })
})
