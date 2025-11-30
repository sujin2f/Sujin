// yarn test clients.spec.ts

import { T_PostImages } from '@sujin/lib/types'
import { getThumbnailFromPost, convertImageBlockURL } from './client'
import { DEFAULT_THUMBNAIL } from '@lib/constants'
import { IMAGE_SIZE } from '@sujin/lib/constants'

describe('clients.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test('ensureImage()', () => {
        const result = convertImageBlockURL({
            mimeType: 'image/jpeg',
            title: 'D853005F-BAF2-474B-8EFF-54EDD771729C',
            width: 1,
            height: 2,
            sizes: {
                medium: {
                    url: '2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                thumbnail: {
                    url: '/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                mediumLarge: {
                    url: 'wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                postThumbnail: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                relatedPost: {
                    url: 'http://sujinc.com/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                recentPost: {
                    url: 'https://sujinc.com/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
            },
            url: '2025/01/file.jpeg',
        })
        expect(result).toStrictEqual({
            mimeType: 'image/jpeg',
            title: 'D853005F-BAF2-474B-8EFF-54EDD771729C',
            width: 1,
            height: 2,
            sizes: {
                medium: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                thumbnail: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                mediumLarge: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                postThumbnail: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                relatedPost: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
                recentPost: {
                    url: '/wp-content/uploads/2025/01/file.jpeg',
                    width: 1,
                    height: 2,
                    mimeType: 'jpg',
                },
            },
            url: '/wp-content/uploads/2025/01/file.jpeg',
        })
    })

    test('getThumbnailFromPost()', () => {
        const result = getThumbnailFromPost(null as unknown as T_PostImages, [IMAGE_SIZE.THUMBNAIL])
        expect(result).toBe(DEFAULT_THUMBNAIL)
    })
})
