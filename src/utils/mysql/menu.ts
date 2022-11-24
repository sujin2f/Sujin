import { MySQLQuery } from 'src/constants/mysql-query'
import { MenuItemTypes, MetaKeys } from 'src/constants/mysql-query'
import { MenuItem, Post, Term } from 'src/types/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { getPostsBy } from 'src/utils/mysql/posts'
import { getAllPostMeta } from 'src/utils/mysql/post-meta'
import { Nullable } from 'src/types/common'

// tslint:disable-next-line: no-var-requires
const PHPUnserialize = require('php-unserialize')

const getMenuItemFromPost = async (post: Post): Promise<Nullable<MenuItem>> => {
    const postMetas = await getAllPostMeta(post.id)
    if (!Object.keys(postMetas).length) {
        return
    }

    const htmlClass =
        Object.values<string>(
            PHPUnserialize.unserialize(postMetas[MetaKeys.MENU_ITEM_CLASSES]),
        ) || []
    const objectId = postMetas[MetaKeys.MENU_ITEM_OBJECT_ID]
    const target = postMetas[MetaKeys.MENU_ITEM_TARGET] || ''
    const type = postMetas[MetaKeys.MENU_ITEM_TYPE]
    const parent = postMetas[MetaKeys.MENU_ITEM_PARENT] || '0'
    let link = postMetas[MetaKeys.MENU_ITEM_URL] || ''
    let title = post.title || ''

    switch (type) {
        case MenuItemTypes.POST_TYPE:
            const queriedPost = await getPostsBy('id', objectId)
            if (!queriedPost.length) {
                return
            }
            title = title || queriedPost[0].title || ''
            link = queriedPost[0].link
            break

        case MenuItemTypes.TAXONOMY:
            const terms = await MySQL.getInstance().query<Term[]>(
                MySQLQuery.getTermBy('id', objectId),
                [],
            )

            if (!terms.length) {
                return
            }

            title = title || terms[0].title
            link = link || `/category/${terms[0].slug}`
            break
    }

    return {
        id: post.id,
        target,
        link,
        htmlClass,
        children: [],
        title,
        parent: parseInt(parent, 10),
    } as MenuItem
}

export const getMenu = async (slug: string): Promise<MenuItem[]> => {
    const posts: Post[] = await MySQL.getInstance().query<Post[]>(
        MySQLQuery.getTermItems(slug, 0),
        [],
    )

    // Convert post to menu item
    const menus: Record<number, MenuItem> = {}
    for await (const post of posts) {
        const menuItem = await getMenuItemFromPost(post)
        if (menuItem) {
            menus[menuItem.id] = menuItem
        }
    }

    // Parent-children relationship
    Object.keys(menus).forEach((menuId) => {
        const key = parseInt(menuId, 10)
        const menuItem = menus[key]
        if (menuItem.parent) {
            menus[menuItem.parent].children.push(menuItem)
            delete menus[key]
        }
    })

    const result = Object.values(menus)
    return Object.values(result)
}
