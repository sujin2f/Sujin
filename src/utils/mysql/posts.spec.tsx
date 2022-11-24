// yarn test posts.spec.ts

import { getPostsBy, getPost } from './posts'

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

describe('posts.ts', () => {
    it('getPostsBy', async () => {
        query.mockResolvedValueOnce([
            {
                date: '2022-11-22',
                slug: 'test',
                type: 'post',
                content: '',
            },
        ])

        const result = await getPostsBy('id', 0)
        expect(result[0]!.link.indexOf('test')).not.toBe(-1)
    })

    it('getPost', async () => {
        query.mockResolvedValueOnce([
            {
                date: '2022-11-22',
                slug: 'test',
                type: 'post',
                content: '',
            },
        ])

        const result = await getPost('slug')
        expect(result!.link.indexOf('test')).not.toBe(-1)
    })
})
