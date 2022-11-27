// yarn test option.spec.ts

import { mediaMeta } from '../../__tests__/fixture'
import { getOption } from './option'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('option.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('getOption', async () => {
        query.mockResolvedValueOnce([
            {
                option_value: mediaMeta.meta_value,
            },
        ])

        const result = await getOption<number>('option', 0, 'height')
        expect(result).toBe(684)
    })

    it('getOption - No result', async () => {
        const result = await getOption<number>('option', 0, 'height')
        expect(result).toBe(undefined)
    })
})
