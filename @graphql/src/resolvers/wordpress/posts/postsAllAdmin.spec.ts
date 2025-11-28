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
import { verifyAccessToken } from '@src/utils/security'
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
        ;(verifyAccessToken as jest.Mock).mockResolvedValue({ sub: { admin: true } })

        const result = await postsAllAdmin(1, 'admin-token')

        expect(verifyAccessToken).toHaveBeenCalledWith('admin-token')
        expect(Post.aggregate).toHaveBeenCalled()
        expect(result).toEqual(fakePosts)
    })

    it('returns [] when no posts found', async () => {
        ;(Post.aggregate as jest.Mock).mockResolvedValue([])
        ;(verifyAccessToken as jest.Mock).mockResolvedValue({ admin: true })

        expect(await postsAllAdmin(1, 'admin-token')).toStrictEqual([])
        expect(verifyAccessToken).toHaveBeenCalled()
    })
})
