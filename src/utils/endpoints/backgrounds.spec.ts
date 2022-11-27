// yarn test backgrounds.spec.ts

import { media, mediaMeta } from '../../__tests__/fixture'
import { backgrounds } from './backgrounds'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('backgrounds.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('backgrounds', async () => {
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

        const result = await backgrounds()
        expect(result[0].sizes[0].file).toBe(
            'https://sujinc.com/wp-content/uploads/2022/11/4-1-300x200.jpg',
        )
    })
})
