// yarn test posts.spec.ts

import { post } from '../../__tests__/fixture'
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
        query
            .mockResolvedValueOnce([
                {
                    ...post,
                    type: 'post',
                },
            ])
            .mockResolvedValueOnce(undefined) // use-background-color
            .mockResolvedValueOnce(undefined) // background-color
            .mockResolvedValueOnce(undefined) // image list
            .mockResolvedValueOnce(undefined) // image icon
            .mockResolvedValueOnce(undefined) // image title
            .mockResolvedValueOnce(undefined) // image background
            .mockResolvedValueOnce(undefined) // image _thumbnail_id
            .mockResolvedValueOnce([post]) // prev
            .mockResolvedValueOnce([post]) // next
            .mockResolvedValueOnce([post, post]) // related tag
            .mockResolvedValueOnce([
                post,
                {
                    ...post,
                    id: 3,
                },
            ]) // related category

        const result = await getPostsBy('id', 0)

        // check the link contains the slug
        expect(result[0]!.link.indexOf(post.slug)).not.toBe(-1)
        // check the related post duplication works
        expect(result[0]!.related.length).toBe(2)
    })

    it('getPost', async () => {
        query.mockResolvedValueOnce([post])

        const result = await getPost('slug', 'slug')
        expect(result!.link.indexOf(post.slug)).not.toBe(-1)
    })
})
