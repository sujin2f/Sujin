// yarn test menu.spec.ts

import { menu } from './menu'

jest.mock('src/utils/node-cache', () => ({
    cached: {
        get: jest.fn(),
        set: jest.fn(),
    },
}))
const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('menu.ts', () => {
    it('menu', async () => {
        const result = await menu({ slug: 'main' })
        expect(result).toStrictEqual([])
    })
})
