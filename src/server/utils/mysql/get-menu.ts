import { SQL_GET_TERM_ITEMS } from 'src/server/constants/query'
import { MenuItem, Nullable, Post } from 'src/types'
import { format } from 'src/utils/common'
import { KEYS } from 'src/server/constants/wp'

import { mysql } from './mysqld'
import { getAllPostMeta } from './get-all-post-meta'
import { getOption } from './get-option'
import { getTerm } from './get-term'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

type NavTerm = Record<string, number>

/**
 * Get the posts from given menu names
 * { menuName: [1, 2, 3] }
 *
 * @param {string} menuName
 * @return {Promise<Nullable<Post[]>>}
 */
const getMenuPosts = async (menuName: string): Promise<Nullable<Post[]>> => {
    const navLocations =
        (await getOption<NavTerm>(KEYS.THEME_MODS, KEYS.NAV_LOCATION)) || {}

    if (!Object.keys(navLocations).includes(menuName)) {
        return
    }

    const connection = await mysql()
    const query = format(SQL_GET_TERM_ITEMS, navLocations[menuName])
    return await connection.query(query)
}

/**
 * Convert Post to MenuItem
 *
 * @param {Post} post
 * @return {Promise<MenuItem>}
 */
const getMenuItemFromPost = async (post: Post): Promise<MenuItem> => {
    const postMetas = await getAllPostMeta(post.id)
    const htmlClass = Object.values(
        PHPUnserialize.unserialize(postMetas['_menu_item_classes']) || {},
    )

    const objectId = parseInt(postMetas['_menu_item_object_id'])
    const target = postMetas['_menu_item_target'] || ''
    const type = postMetas['_menu_item_type'] || ''
    let url = postMetas['_menu_item_url']
    let title = post.title

    switch (type) {
        case 'post_type':
            title = title || post.title || ''
            // TODO To pretty URL
            url = url || post.guid || ''
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
        ...post,
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
 * @param {{ menuName: string }} { menuName }
 * @return {Promise<MenuGroup>}
 */
export const getMenu = async ({
    menuName,
}: {
    menuName: string
}): Promise<MenuItem[]> => {
    const posts = await getMenuPosts(menuName)

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

    return Object.values(menus)
}
