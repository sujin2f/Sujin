/**
 * yarn test postsAllAdmin.spec.ts
 */

// Mock Post model
import { PostMock } from '@test/mocks/GQL-model'
jest.doMock('@src/schema/post', () => PostMock)
import { Post } from '@src/schema/post'
// Mock security.ts
import SecurityMock from '@test/mocks/utils/security'
jest.doMock('@src/utils/security', () => SecurityMock)
import { verifyAdmin } from '@src/utils/security'
// Mock Logger
import LoggerMock from '@test/mocks/utils/logger'
jest.doMock('@sujin/share/model/Logger', () => LoggerMock)

import { postsAllAdmin } from '@src/resolvers/wordpress/posts/postsAllAdmin'

beforeEach(() => {
    jest.clearAllMocks()
})

describe('postsAllAdmin', () => {
    it('returns posts when Post.aggregate resolves with results', async () => {
        expect(true).toBe(true)
        const fakePosts = [{ id: 1, title: 'Hello' }]
        ;(Post.aggregate as jest.Mock).mockResolvedValue(fakePosts)

        const result = await postsAllAdmin(1, 'admin-token')

        expect(verifyAdmin).toHaveBeenCalledWith('admin-token', expect.any(String))
        expect(Post.aggregate).toHaveBeenCalled()
        expect(result).toEqual(fakePosts)
    })

    it('throws GraphQLError when no posts found', async () => {
        ;(Post.aggregate as jest.Mock).mockResolvedValue([])

        await expect(postsAllAdmin(1, 'admin-token')).rejects.toThrow('Cannot find any post')
        expect(verifyAdmin).toHaveBeenCalled()
    })
})
