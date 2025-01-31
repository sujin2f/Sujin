'use server'

import type { MenuItem, Post, Term } from '@src/types/wordpress'
import { isEmpty } from '@common/utils/object'
import { MySQLQuery, MenuItemTypes, MetaKeys } from '@src/constants/mysql-query'
import { Nullable } from '@common/types'
import { unserialize } from '@src/utils/wordpress'
import { MySQL } from '@src/db/mysql'
import { request as getPost } from '@src/db/mysql/getPost'
import { getAllPostMeta } from '@src/db/mysql/getAllPostMeta'
import { Logger } from '@common/model/Logger'

const getMenuItemFromPost = async (post: Post): Promise<Nullable<MenuItem>> => {
    const result = {} as MenuItem
    result.id = post.id
    result.children = []

    const meta = await getAllPostMeta(post.id)
    if (isEmpty(meta)) {
        return
    }

    const htmlClass = unserialize(meta[MetaKeys.MENU_ITEM_CLASSES], {})
    const objectId = meta[MetaKeys.MENU_ITEM_OBJECT_ID]
    const type = meta[MetaKeys.MENU_ITEM_TYPE]
    const parent = meta[MetaKeys.MENU_ITEM_PARENT] || '0'

    result.link = meta[MetaKeys.MENU_ITEM_URL] || ''
    result.title = post.title || ''
    result.parent = parseInt(parent)
    result.target = meta[MetaKeys.MENU_ITEM_TARGET] || ''
    result.htmlClass = Object.values<string>(htmlClass)

    if (type === MenuItemTypes.POST_TYPE) {
        const queriedPost = await getPost('id', objectId)
        if (!queriedPost) {
            return
        }
        result.title = result.title || queriedPost.title || ''
        result.link = queriedPost.link
    }

    if (type === MenuItemTypes.TAXONOMY) {
        const term = await MySQL.getInstance().selectOne<Term>(
            MySQLQuery.getTermBy('id', objectId),
        )

        if (!term) {
            return
        }

        result.title = result.title || term.title
        result.link = result.link || `/category/${term.slug}`
    }

    return result
}

export const request = async (slug: string): Promise<MenuItem[]> => {
    Logger.server(`Menu Requested ${slug}`)
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
