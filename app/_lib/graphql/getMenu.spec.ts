// yarn test getMenu.spec.ts

import '@testing-library/jest-dom'
import { getMenu } from './getMenu'
import { DEFAULT_MENUS } from '@app/_lib/constants'

/* Mock: logger @test/mock.logger */
jest.mock('@sujin/share/model/Logger', () => ({
    Logger: {
        error: jest.fn(),
    },
}))
/* Mock: GQL @test/mock.gql */
const mockQuery = jest.fn()
jest.mock('@app/_lib/graphql/client', () => ({
    client: {
        query: async () => mockQuery,
        mutate: async () => mockQuery,
    },
}))

describe('getMenu.spec.ts', () => {
    it('getMenu()', async () => {
        const menu = await getMenu('slug')
        expect(menu).toStrictEqual(DEFAULT_MENUS)
    })
})
