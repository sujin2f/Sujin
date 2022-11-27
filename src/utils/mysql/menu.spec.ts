// yarn test menu.spec.ts

import { menuItem, menuItemMeta, post, term } from '../../__tests__/fixture'
import { getMenu } from './menu'

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

    it('getMenu: parent relationship', async () => {
        query
            .mockResolvedValueOnce([
                menuItem,
                {
                    ...menuItem,
                    id: 100,
                },
            ])
            .mockResolvedValueOnce(menuItemMeta)
            .mockResolvedValueOnce([term])
            .mockResolvedValueOnce([
                ...menuItemMeta,
                {
                    meta_key: '_menu_item_menu_item_parent',
                    meta_value: menuItem.id,
                },
                {
                    meta_key: '_menu_item_type',
                    meta_value: 'post_type',
                },
            ])
            .mockResolvedValueOnce([post])

        const result = await getMenu('main')

        expect(result![0].link).toBe('/category/uncategorized')
        expect(result![0].children[0].id).toBe(100)
        expect(result![0].children[0].title).toBe(post.title)
    })

    it('getMenu: No menu item', async () => {
        const result = await getMenu('main')
        expect(result).toStrictEqual([])
    })

    it('getMenu: Menu item does not have metadata', async () => {
        query.mockResolvedValueOnce([menuItem])
        const result = await getMenu('main')
        expect(result).toStrictEqual([])
    })
})
