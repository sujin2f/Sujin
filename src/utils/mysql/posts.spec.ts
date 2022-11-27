// yarn test posts.spec.ts

import { media, mediaMeta, post, term } from '../../__tests__/fixture'
import { getPostsBy, getPost } from './posts'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('posts.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('getPostsBy', async () => {
        query
            .mockResolvedValueOnce([
                {
                    ...post,
                    type: 'post',
                },
            ])
            .mockResolvedValueOnce([term]) // post term
            .mockResolvedValueOnce(undefined) // post use-background-color
            .mockResolvedValueOnce(undefined) // post background-color
            .mockResolvedValueOnce(undefined) // post image list
            .mockResolvedValueOnce(undefined) // post image icon
            .mockResolvedValueOnce(undefined) // post image title
            .mockResolvedValueOnce(undefined) // post image background
            .mockResolvedValueOnce([
                {
                    meta_value: 1,
                },
            ]) // post image _thumbnail_id
            .mockResolvedValueOnce([media]) // thumbnail
            .mockResolvedValueOnce(undefined) // thumbnail term
            .mockResolvedValueOnce(undefined) // thumbnail use-background-color
            .mockResolvedValueOnce(undefined) // thumbnail background-color
            .mockResolvedValueOnce(undefined) // thumbnail image list
            .mockResolvedValueOnce(undefined) // thumbnail image icon
            .mockResolvedValueOnce(undefined) // thumbnail image title
            .mockResolvedValueOnce(undefined) // thumbnail image background
            .mockResolvedValueOnce(undefined) // thumbnail image _thumbnail_id
            .mockResolvedValueOnce([mediaMeta]) // thumbnail meta
            .mockResolvedValueOnce([post]) // post prev
            .mockResolvedValueOnce(undefined) // post next
            .mockResolvedValueOnce([
                {
                    ...post,
                    id: 10,
                },
                {
                    ...post,
                    id: 10,
                },
            ]) // post related tag
            .mockResolvedValueOnce([
                {
                    ...post,
                    id: 10,
                },
                {
                    ...post,
                    id: 3,
                },
            ]) // post related category

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
