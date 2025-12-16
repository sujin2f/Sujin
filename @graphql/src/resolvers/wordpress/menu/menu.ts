import sanitize from 'mongo-sanitize'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { MenuItem } from '@src/schema/menu'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
/* T_Types */
import type { MenuItem as T_MenuItem } from '@sujin/lib/types/menu'
/* Utils */
import { setCache } from '@src/utils/redis/cache'

/**
 * Fetch a single published post by slug and expand related archive data.
 *
 * Uses an aggregation pipeline to expand archive references and throws a
 * GraphQLError with code `NO_CONTENT` when the post cannot be found.
 *
 * @param _slug - The post slug to fetch.
 * @returns The `T_Post` document for the requested slug.
 * @throws {GraphQLError} When the post is not found.
 */
export const menu = async (_position: string): Promise<T_MenuItem[]> => {
    const position = sanitize(_position)
    const items = await MenuItem.find({ position }).sort({ order: 1 })
    const menu: T_MenuItem[] = []
    items.forEach((item) => {
        let link = item.link
        try {
            if (!item.target) {
                const newLink = new URL(item.link)
                link = `/${newLink.pathname}`
            }
        } catch {
            // do nothing
        }
        if (!item.parent) {
            menu.push({ ...item, link, children: [] })
            return
        }

        menu[menu.length - 1].children?.push({ ...item, link })
    })

    setCache(JSON.stringify(menu), `${COLLECTION.MENU}-${_position}`, WEEK_IN_SECONDS)
    Logger.info(`⭐️ menu query done: ${_position}`)
    return menu
}
