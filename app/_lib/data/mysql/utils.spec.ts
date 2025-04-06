// yarn test utils.spec.ts

import { unserialize, convertImageBlockURL } from './utils'

jest.mock('php-unserialize', () => ({
    unserialize: () => ({
        key: 'value',
    }),
}))

describe('utils.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    describe('unserialize()', () => {
        it('Empty', () => {
            const result = unserialize('', 'You are welcome')
            expect(result).toBe('You are welcome')
        })

        it('Not Serialized Text', () => {
            const result = unserialize('Thank you', 'You are welcome')
            expect(result).toBe('Thank you')
        })

        it('Key does not exist', () => {
            const result = unserialize('a:{}', 'You are welcome', 'lock')
            expect(result).toBe('You are welcome')
        })
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
})
