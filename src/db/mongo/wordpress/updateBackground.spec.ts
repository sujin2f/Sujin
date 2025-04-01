// yarn test updateBackground.spec.ts

import { clearMongo } from '../../../../.jest/helpers'
import updateBackground from './updateBackground'
import Mongo from '@common/data/mongo/mongo'

const mockQuery = jest.fn()
jest.mock('promise-mysql', () => ({
    createConnection: jest.fn(() => ({
        query: mockQuery,
    })),
}))
jest.mock('php-unserialize', () => ({
    unserialize: () => ({
        width: 800,
        height: 582,
        file: '2025/01/D853005F-BAF2-474B-8EFF-54EDD771729C.jpeg',
        filesize: 50332,
        'mime-type': 'image/jpeg',
        sizes: {
            medium: {
                file: 'D853005F-BAF2-474B-8EFF-54EDD771729C.jpeg',
                width: 800,
                height: 582,
                'mime-type': 'image/jpeg',
            },
        },
    }),
}))

describe('updateBackground.ts', () => {
    beforeAll(async () => {
        await clearMongo('backgrounds')
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo('backgrounds').then((client) => {
            client.close()
        })
    })

    test('updateBackground()', async () => {
        const nonce = 'nonce'

        mockQuery.mockImplementation((arg: string) => {
            if (arg.includes('update_background_nonce')) {
                return Promise.resolve([
                    {
                        key: 'update_background_nonce',
                        option_value: 'nonce-1',
                    },
                ])
            }

            if (
                arg.includes(
                    'WHERE posts.ID="1" AND posts.post_type="attachment"',
                )
            ) {
                return Promise.resolve([
                    {
                        id: 1,
                        title: 'Test',
                        slug: 'test',
                        type: 'page',
                        content: '',
                    },
                ])
            }

            if (
                arg.includes(
                    'WHERE post_id="1" AND meta_key="_wp_attachment_metadata"',
                )
            ) {
                return Promise.resolve([
                    {
                        key: '_wp_attachment_metadata',
                        meta_value: 'value',
                    },
                ])
            }

            return Promise.resolve([])
        })
        await updateBackground(nonce, 1)

        const post = await Mongo.findOne('backgrounds', { id: 1 })
        expect(post.title).toEqual('Test')
    })
})
