// yarn test post.spec.ts

import { post } from './post'
import { post as postData } from '../../__tests__/fixture'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('post.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('post: No post', async () => {
        await post({ slug: 'main' })
            .then(() => expect(true).toBeFalsy())
            .catch(() => expect(true).toBeTruthy())
    })

    it('post: No post', async () => {
        query
            .mockResolvedValueOnce(undefined) // Checking Update
            .mockResolvedValueOnce([postData])
        const result = await post({ slug: 'main' })
        expect(result!.title).toBe(postData.title)
    })
})
