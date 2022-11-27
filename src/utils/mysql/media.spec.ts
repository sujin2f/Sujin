// yarn test media.spec.ts

import { media, mediaMeta } from '../../__tests__/fixture'
import { getMedia, getBackgrounds } from './media'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('media.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('getMedia', async () => {
        query
            .mockResolvedValueOnce([media])
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce([mediaMeta])

        const result = await getMedia(1)
        expect(result!.sizes[0].file).toBe(
            'https://sujinc.com/wp-content/uploads/2022/11/4-1-300x200.jpg',
        )
    })

    it('getMedia: No Post', async () => {
        const result = await getMedia(1)
        expect(result).toBe(undefined)
    })

    it('getMedia: No Metadata', async () => {
        query.mockResolvedValueOnce([media])
        const result = await getMedia(1)
        expect(result).toBe(undefined)
    })

    it('getBackgrounds', async () => {
        query
            .mockResolvedValueOnce([media])
            .mockResolvedValueOnce([media])
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce([mediaMeta])

        const result = await getBackgrounds()
        expect(result[0].sizes[0].file).toBe(
            'https://sujinc.com/wp-content/uploads/2022/11/4-1-300x200.jpg',
        )
    })

    it('getBackgrounds: Nothing', async () => {
        const result = await getBackgrounds()
        expect(result).toStrictEqual([])
    })
})
