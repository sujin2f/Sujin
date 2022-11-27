// yarn test menu.spec.ts

import { menu } from './menu'

const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('menu.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    it('menu', async () => {
        const result = await menu({ slug: 'main' })
        expect(result).toStrictEqual([])
    })
})
