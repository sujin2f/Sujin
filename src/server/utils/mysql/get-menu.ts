import { SQL_GET_TERM_ITEMS } from 'src/constants/query'
import { MenuItem, Post } from 'src/types'
import { format } from 'src/utils'

import { mysql } from './mysqld'
import { getAllPostMeta } from './get-all-post-meta'
import { getTerm } from './get-term'
import { getPostsBy } from './get-posts-by'
import { cached } from '../node-cache'
import { dateToPrettyUrl } from 'src/utils/common'

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
    const htmlClass = Object.values(
        PHPUnserialize.unserialize(postMetas['_menu_item_classes']) || {},
    )

    const objectId = parseInt(postMetas['_menu_item_object_id'])
    const target = postMetas['_menu_item_target'] || ''
    const type = postMetas['_menu_item_type'] || ''
    let url = postMetas['_menu_item_url']
    let title = menu.title

    switch (type) {
        case 'post_type':
            const post = (await getPostsBy('id', objectId))[0]
            title = title || post.title || ''
            url =
                post.type === 'page'
                    ? `/${post.slug}`
                    : `/${dateToPrettyUrl(post.date)}/${post.slug}`
            break
        case 'taxonomy':
            const term =
                !title || !url
                    ? await getTerm(objectId)
                    : { name: '', slug: '' }
            title = title || term?.name || ''
            url = url || `/category/${term?.slug}` || ''
            break
    }

    return {
        ...menu,
        target,
        url,
        type,
        htmlClass,
        objectId,
        children: [],
        title,
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
    const cache = cached.get<MenuItem[]>(`mysql-get-menu-${menuName}`)
    if (cache) {
        return cache
    }

    const connection = await mysql()
    const query = format(SQL_GET_TERM_ITEMS, menuName)
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
    cached.set<MenuItem[]>(`mysql-get-menu-${menuName}`, result)
    return Object.values(result)
}
