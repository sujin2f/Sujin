// yarn test menu.spec.ts

import { getMenu } from './menu'

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
    it('getMenu', async () => {
        query
            .mockResolvedValueOnce([
                {
                    id: 1,
                    date: '2022-11-22',
                    slug: 'test',
                    type: 'nav_menu_item',
                },
            ])
            .mockResolvedValueOnce([
                {
                    meta_key: '_menu_item_type',
                    meta_value: 'taxonomy',
                },
                {
                    meta_key: '_menu_item_object_id',
                    meta_value: '1',
                },
                {
                    meta_key: '_menu_item_object_id',
                    meta_value: 'category',
                },
                {
                    meta_key: '_menu_item_classes',
                    meta_value: 'a:1:{i:0;s:0:"";}',
                },
            ])
            .mockResolvedValueOnce([
                {
                    title: 'category',
                    slug: 'category',
                },
            ])

        const result = await getMenu('main')
        expect(result![0].link).toBe('/category/category')
    })
})
