import {
    MySQLQuery,
    CacheKeys,
    MetaKeys,
    MenuItemTypes,
    ErrorMessage,
} from 'src/constants'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { MenuItem, Post } from 'src/types'
import { mysql, cached, getAllPostMeta, getTermBy, getPostsBy } from 'src/utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Convert Post to MenuItem
 *
 * @param {Post} menu
 * @return {Promise<MenuItem>}
 * @throws
 */
const getMenuItemFromPost = async (menu: Post): Promise<MenuItem> => {
    const postMetas = await getAllPostMeta(menu.id).catch(() => undefined)
    if (!postMetas) {
        return {
            id: menu.id,
            title: menu.title,
            target: '',
            link: menu.link,
            htmlClass: [],
            children: [],
            parent: 0,
        }
    }

    const htmlClass = Object.values<string>(
        PHPUnserialize.unserialize(postMetas[MetaKeys.MENU_ITEM_CLASSES]),
    )
    const objectId = postMetas[MetaKeys.MENU_ITEM_OBJECT_ID]
    const target = postMetas[MetaKeys.MENU_ITEM_TARGET]
    const type = postMetas[MetaKeys.MENU_ITEM_TYPE]
    const parent = postMetas[MetaKeys.MENU_ITEM_PARENT]
    let link = postMetas[MetaKeys.MENU_ITEM_URL]
    let title = menu.title

    switch (type) {
        case MenuItemTypes.POST_TYPE:
            const post = await getPostsBy('id', objectId).catch(() => undefined)

            if (post) {
                title = title || post[0].title || ''
                link = post[0].link
            }
            break

        case MenuItemTypes.TAXONOMY:
            const term = (await getTermBy({
                key: 'id',
                value: objectId,
            }).catch(() => ({ title: '', slug: '' }))) || {
                title: '',
                slug: '',
            }
            title = title || term.title
            link = link || `/category/${term.slug}`
            break
    }

    return {
        id: menu.id,
        target: target || '',
        link: link || '',
        htmlClass: htmlClass || [],
        children: [],
        title: title || '',
        parent: parseInt(parent || ''),
    } as MenuItem
}

/**
 * Get menu items from the given menu name
 *
 * @param {string} menuName
 * @return {Promise<MenuItem[]>}
 * @throws
 */
export const getMenu = async ({
    menuName,
}: {
    menuName: string
}): Promise<MenuItem[]> => {
    // Caching
    const cacheKey = `${CacheKeys.MENU}-${menuName}`
    const cache = cached.get<MenuItem[]>(cacheKey)
    if (cache && process.env.USE_CACHE) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const posts: Post[] = await connection
        .query(MySQLQuery.getTermItems(menuName, 0))
        .catch(() => [])

    if (!posts || !posts.length) {
        return []
    }

    // Convert post to menu item
    const menus: Record<number, MenuItem> = {}
    for (const post of posts) {
        const menu = await getMenuItemFromPost(post).catch(() => undefined)
        if (menu) {
            menus[post.id] = menu
        }
    }

    // Parent-children relationship
    Object.keys(menus).forEach((menuId) => {
        const menu = menus[parseInt(menuId)]
        if (menu.parent) {
            menus[menu.parent].children.push(menu)
            delete menus[parseInt(menuId)]
        }
    })

    const result = Object.values(menus)
    cached.set<MenuItem[]>(cacheKey, result)
    return Object.values(result)
}
