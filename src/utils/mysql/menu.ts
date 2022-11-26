import { isEmpty } from 'src/common/utils/object'
import { MySQLQuery, MenuItemTypes, MetaKeys } from 'src/constants/mysql-query'
import { MenuItem, Post, Term } from 'src/types/wordpress'
import { Nullable } from 'src/types/common'
import { unserialize } from 'src/utils/wordpress'
import { MySQL } from 'src/utils/mysql/mysqld'
import { getPost } from 'src/utils/mysql/posts'
import { getAllPostMeta } from 'src/utils/mysql/post-meta'

const getMenuItemFromPost = async (post: Post): Promise<Nullable<MenuItem>> => {
    const result = {} as MenuItem
    result.id = post.id
    result.children = []

    const meta = await getAllPostMeta(post.id)
    if (isEmpty(meta)) {
        return
    }

    const htmlClass = unserialize<Record<string, any>>(
        meta[MetaKeys.MENU_ITEM_CLASSES],
        {},
    )
    const objectId = meta[MetaKeys.MENU_ITEM_OBJECT_ID]
    const type = meta[MetaKeys.MENU_ITEM_TYPE]
    const parent = meta[MetaKeys.MENU_ITEM_PARENT] || '0'

    result.link = meta[MetaKeys.MENU_ITEM_URL] || ''
    result.title = post.title || ''
    result.parent = parseInt(parent)
    result.target = meta[MetaKeys.MENU_ITEM_TARGET] || ''
    result.htmlClass = Object.values<string>(htmlClass)

    switch (type) {
        case MenuItemTypes.POST_TYPE:
            const queriedPost = await getPost('id', objectId)
            if (!queriedPost) {
                return
            }
            result.title = result.title || queriedPost.title || ''
            result.link = queriedPost.link
            break

        case MenuItemTypes.TAXONOMY:
            const term = await MySQL.getInstance().selectOne<Term>(
                MySQLQuery.getTermBy('id', objectId),
            )

            if (!term) {
                return
            }

            result.title = result.title || term.title
            result.link = result.link || `/category/${term.slug}`
            break
    }

    return result
}

export const getMenu = async (slug: string): Promise<MenuItem[]> => {
    const result: Record<number, MenuItem> = {}

    const posts = await MySQL.getInstance().select<Post>(
        MySQLQuery.getTermItems(slug, 0),
    )

    // Convert post to menu item
    for await (const post of posts) {
        const menuItem = await getMenuItemFromPost(post)
        if (menuItem) {
            result[menuItem.id] = menuItem
        }
    }

    // Parent-children relationship
    Object.keys(result).forEach((menuId) => {
        const key = parseInt(menuId)
        const menuItem = result[key]
        if (menuItem.parent) {
            result[menuItem.parent].children.push(menuItem)
            delete result[key]
        }
    })

    return Object.values(result)
}
