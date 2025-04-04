// yarn test wordpress.spec.ts

import { unserialize, convertImageBlockURL } from './wordpress'

jest.mock('php-unserialize', () => ({
    unserialize: () => ({
        key: 'value',
    }),
}))

describe('wordpress.ts', () => {
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
            sizes: [
                {
                    key: 'medium',
                    file: '2025/01/file.jpeg',
                },
                {
                    key: 'thumbnail',
                    file: '/2025/01/file.jpeg',
                },
                {
                    key: 'medium_large',
                    file: 'wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'post-thumbnail',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'related-post',
                    file: 'http://sujinc.com/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'recent-post',
                    file: 'https://sujinc.com/wp-content/uploads/2025/01/file.jpeg',
                },
            ],
            url: '2025/01/file.jpeg',
        })
        expect(result).toStrictEqual({
            mimeType: 'image/jpeg',
            title: 'D853005F-BAF2-474B-8EFF-54EDD771729C',
            sizes: [
                {
                    key: 'medium',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'thumbnail',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'medium_large',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'post-thumbnail',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'related-post',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
                {
                    key: 'recent-post',
                    file: '/wp-content/uploads/2025/01/file.jpeg',
                },
            ],
            url: '/wp-content/uploads/2025/01/file.jpeg',
        })
    })
})
