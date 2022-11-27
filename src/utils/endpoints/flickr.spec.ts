// yarn test flickr.spec.ts

import { flickr } from './flickr'

jest.mock('axios', () => ({
    get: async () => ({
        data: {
            items: [
                {
                    media: {
                        m: 'photo.jpg',
                    },
                },
            ],
        },
    }),
}))

describe('flickr.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('flickr: No ID', async () => {
        const result = await flickr()
        expect(result).toStrictEqual([])
    })

    it('flickr', async () => {
        process.env.FLICKR_ID = 'test'
        const result = await flickr()
        expect(result[0].media).toBe('photo.jpg')
    })
})
