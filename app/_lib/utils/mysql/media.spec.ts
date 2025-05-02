// yarn test media.spec.ts

import { post } from '@jest/fixture'
import { getMedia } from './getMedia'
// import { ARCHIVE } from '@app/_lib/types'

const mockQueryPost = jest.fn()
const mockQueryMeta = jest.fn()
jest.mock('./getPostBy', () => ({
    getPostBy: () => mockQueryPost(),
}))
jest.mock('./getPostMeta', () => ({
    getPostMeta: () => mockQueryMeta(),
}))

describe('media.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test('getMedia()', async () => {
        mockQueryPost.mockResolvedValue(post)
        mockQueryMeta.mockResolvedValue({
            file: '/wp-content/uploads/test.jpg',
            sizes: {
                medium: {
                    file: 'test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
                omit: {
                    file: '/wp-content/uploads/test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
                medium_large: {
                    file: 'wp-content/uploads/test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
                'post-thumbnail': {
                    file: '/wp-content/uploads/test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
                'related-post': {
                    file: '/wp-content/uploads/test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
                'recent-post': {
                    file: '/wp-content/uploads/test-medium.jpg',
                    'mime-type': 'image/jpeg',
                },
            },
        })

        const media = await getMedia(1)
        expect(media?.url).toBe('/wp-content/uploads/test.jpg')
        expect(media?.sizes?.medium?.url).toBe(
            '/wp-content/uploads/test-medium.jpg',
        )
        expect(media?.sizes?.omit?.url).toBe(
            '/wp-content/uploads/test-medium.jpg',
        )
        expect(media?.sizes?.mediumLarge?.url).toBe(
            '/wp-content/uploads/test-medium.jpg',
        )
        expect(media?.sizes?.postThumbnail?.url).toBe(
            '/wp-content/uploads/test-medium.jpg',
        )
    })
})
