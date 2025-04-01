// yarn test updateTerm.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import updateTerm from './updateTerm'
import Mongo from '@common/data/mongo/mongo'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))

describe('updateTerm.ts', () => {
    beforeAll(async () => {
        await clearMongo('term')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('term').then((client) => {
            client.close()
        })
    })

    test('updateTerm()', async () => {
        const nonce = 'nonce'

        mockQuery
            .mockResolvedValue([
                {
                    id: 1,
                    name: 'Test',
                    slug: 'test',
                    type: 'category',
                },
            ])
            .mockResolvedValueOnce([
                {
                    key: 'update_term_nonce',
                    option_value: 'nonce-1',
                },
            ])
        await updateTerm(nonce, 1)

        const term = await Mongo.findOne('term', { id: 1 })
        expect(term.name).toEqual('Test')
        expect(term.slug).toEqual('test')
    })
})
