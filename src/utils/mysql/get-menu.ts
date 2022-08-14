import { CacheKeys } from 'src/constants/cache-keys'
import { ErrorMessage } from 'src/constants/errors'
import { MySQLQuery } from 'src/constants/mysql-query'
import { MenuItemTypes, MetaKeys } from 'src/constants/mysql-query'
import { MenuItem, Post, Term } from 'src/types/wordpress'
import { cached } from 'src/utils/node-cache'
import { mysql } from 'src/utils/mysql/mysqld'
import { getPostsBy } from 'src/utils/mysql/get-posts-by'
import { getAllPostMeta } from 'src/utils/mysql/get-all-post-meta'

// tslint:disable-next-line: no-var-requires
const PHPUnserialize = require('php-unserialize')

/**
 * Convert Post to MenuItem
 *
 * @param {Post} post
 * @return {Promise<MenuItem>}
 * @throws
 */
const getMenuItemFromPost = async (post: Post): Promise<MenuItem> => {
    const postMetas = await getAllPostMeta(post.id).catch(() => undefined)
    if (!postMetas) {
        return {
            id: post.id,
            title: post.title,
            target: '',
            link: post.link,
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
    let title = post.title

    switch (type) {
        case MenuItemTypes.POST_TYPE:
            const queriedPost = await getPostsBy('id', objectId).catch(
                () => undefined,
            )

            if (queriedPost) {
                title = title || queriedPost[0].title || ''
                link = queriedPost[0].link
            }
            break

        case MenuItemTypes.TAXONOMY:
            const connection = await mysql().catch(() => {
                throw new Error(ErrorMessage.MYSQL_CONNECTION)
            })
            const terms: Term[] = (await connection
                .query(MySQLQuery.getTermBy('id', objectId))
                .catch(() => [{ title: '', slug: '' }])) || [
                { title: '', slug: '' },
            ]

            title = title || terms[0].title
            link = link || `/category/${terms[0].slug}`
            break
    }

    return {
        id: post.id,
        target: target || '',
        link: link || '',
        htmlClass: htmlClass || [],
        children: [],
        title: title || '',
        parent: parseInt(parent || '', 10),
    } as MenuItem
}

/**
 * Get menu items from the given menu name
 *
 * @param {string} menuName
 * @return {Promise<MenuItem[]>}
 * @throws
 */
export const getMenu = async (slug: string): Promise<MenuItem[]> => {
    // Caching
    const cacheKey = `${CacheKeys.MENU}-${slug}`
    const cache = cached.get<MenuItem[]>(cacheKey)
    if (cache && process.env.MYSQL_CACHE_TTL) {
        return cache
    }

    // MySQL connection
    const connection = await mysql().catch(() => {
        throw new Error(ErrorMessage.MYSQL_CONNECTION)
    })
    const posts: Post[] = await connection
        .query(MySQLQuery.getTermItems(slug, 0))
        .catch(() => [])

    if (!posts || !posts.length) {
        return []
    }

    // Convert post to menu item
    const menus: Record<number, MenuItem> = {}
    for (const post of posts) {
        const menuItem = await getMenuItemFromPost(post).catch(() => undefined)
        if (menuItem) {
            menus[post.id] = menuItem
        }
    }

    // Parent-children relationship
    Object.keys(menus).forEach((menuId) => {
        const menuItem = menus[parseInt(menuId, 10)]
        if (menuItem.parent) {
            menus[menuItem.parent].children.push(menuItem)
            delete menus[parseInt(menuId, 10)]
        }
    })

    const result = Object.values(menus)
    cached.set<MenuItem[]>(cacheKey, result)
    return Object.values(result)
}
