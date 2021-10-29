import { MySQLQuery, CacheKeys, MetaKeys, MenuItemTypes } from 'src/constants'
import { MenuItem, Post } from 'src/types'
import {
    mysql,
    cached,
    isDev,
    getAllPostMeta,
    getTerm,
    getPostsBy,
} from 'src/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Convert Post to MenuItem
 *
 * @param {Post} menu
 * @return {Promise<MenuItem>}
 */
const getMenuItemFromPost = async (menu: Post): Promise<MenuItem> => {
    const postMetas = await getAllPostMeta(menu.id)
    const htmlClass = Object.values<string>(
        PHPUnserialize.unserialize(postMetas[MetaKeys.MENU_ITEM_CLASSES]) || {},
    )

    const objectId = parseInt(postMetas[MetaKeys.MENU_ITEM_OBJECT_ID])
    const target = postMetas[MetaKeys.MENU_ITEM_TARGET] || ''
    const type = postMetas[MetaKeys.MENU_ITEM_TYPE] || ''
    let link = postMetas[MetaKeys.MENU_ITEM_URL]
    let title = menu.title

    switch (type) {
        case MenuItemTypes.POST_TYPE:
            const post = (
                await getPostsBy({ key: 'id', value: objectId.toString() })
            )[0]
            title = title || post.title || ''
            link = post.link
            break
        case MenuItemTypes.TAXONOMY:
            const term =
                !title || !link
                    ? await getTerm(objectId)
                    : { name: '', slug: '' }
            title = title || term?.name || ''
            link = link || `/category/${term?.slug}` || ''
            break
    }

    return {
        id: menu.id,
        target,
        link,
        htmlClass,
        children: [],
        title,
        parent: menu.parent,
    } as MenuItem
}

/**
 * Get menu items from the given menu name
 *
 * @param {string} menuName
 * @return {Promise<MenuItem[]>}
 */
export const getMenu = async ({
    menuName,
}: {
    menuName: string
}): Promise<MenuItem[]> => {
    const cache = cached.get<MenuItem[]>(`${CacheKeys.MENU}-${menuName}`)
    if (cache && !isDev()) {
        return cache
    }

    const connection = await mysql()
    const query = MySQLQuery.getTermItems(menuName)
    const posts = await connection.query(query)

    if (!posts) {
        return []
    }

    // Convert post to menu item
    const menus: Record<string, MenuItem> = {}
    for (const post of posts) {
        menus[post.id] = await getMenuItemFromPost(post)
    }

    // Parent-children relationship
    Object.keys(menus).forEach((menuId: string) => {
        if (menus[menuId].parent) {
            menus[menus[menuId].parent].children.push(menus[menuId])
            delete menus[menuId]
        }
    })

    const result = Object.values(menus)
    cached.set<MenuItem[]>(`${CacheKeys.MENU}-${menuName}`, result)
    return Object.values(result)
}
