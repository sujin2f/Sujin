// yarn test updateTerm.spec.ts

import client from '@common/data/mongo/mongo-client'
import updateTerm from './updateTerm'
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
                await database.collection('term').drop()
            } catch {}
        })
    })

    test('updateTerm()', async () => {
        const nonce = 'nonce'

        mockQuery
            .mockResolvedValueOnce([
                {
                    key: 'update_term_nonce',
                    option_value: 'nonce-1',
                },
            ])
            .mockResolvedValueOnce('')
            .mockResolvedValueOnce([
                {
                    id: 1,
                    name: 'Test',
                    slug: 'test',
                    type: 'category',
                },
            ])
        await updateTerm(nonce, 1)

        const term = await Mongo.findOne('term', { id: 1 })
        expect(term.name).toEqual('Test')
        expect(term.slug).toEqual('test')
    })
})
