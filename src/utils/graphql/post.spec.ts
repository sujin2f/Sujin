// yarn test post.spec.ts

import { post } from './post'
import { post as postData } from '../../__tests__/fixture'

jest.mock('src/utils/node-cache', () => ({
    cached: {
        get: jest.fn(),
        set: jest.fn(),
    },
}))
const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('post.ts', () => {
    it('post: No post', async () => {
        await post({ slug: 'main' })
            .then(() => expect(true).toBeFalsy())
            .catch(() => expect(true).toBeTruthy())
    })

    it('post: No post', async () => {
        query.mockResolvedValueOnce([postData])
        const result = await post({ slug: 'main' })
        expect(result!.title).toBe(postData.title)
    })
})
