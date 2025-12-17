/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { MenuItem } from '@src/schema/menu'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
import { COLLECTION } from '@sujin/lib/constants'

export const updateMenu = async (position: string) => {
    await MenuItem.deleteMany({ position })

    const location = await fetch(`${process.env.WP_REST_BASE_URL}/wp-json/wp/v2/menu-locations/${position}`, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST menu-location -- ${position}`)
            throw new Error(`🤬 Failed to request REST menu-location -- ${position}`)
        }
        const json = (await response.json()) as { menu: number }
        if (!json.menu) {
            Logger.error(`🤬 Failed to request REST menu-location -- ${position}`)
            throw new Error(`🤬 Failed to request REST menu-location -- ${position}`)
        }
        return json.menu
    })

    const menu = await fetch(`${process.env.WP_REST_BASE_URL}/wp-json/wp/v2/menu-items/?menus=${location}`, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST menu-items -- ${position}`)
            throw new Error(`🤬 Failed to request REST menu-items -- ${position}`)
        }
        const json = (await response.json()) as T_Page[]
        if (!json || !json.length) {
            Logger.error(`🤬 Failed to request REST menu-items -- ${position}`)
            throw new Error(`🤬 Failed to request REST menu-items -- ${position}`)
        }
        return json
    })

    for (const item of menu) {
        await MenuItem.findOne({ id: item.id }).then(async (result) => {
            const menuItem = {
                position,
                id: item.id,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                title: (item.title as any).rendered,
                target: item.target,
                link: item.url,
                parent: item.parent,
                order: item.menu_order,
            }
            if (!result) {
                await MenuItem.insertOne(menuItem)
            } else {
                await MenuItem.updateOne({ id: item.id }, menuItem)
            }
        })
    }

    removeCache(`${COLLECTION.MENU}-${position}`)
    Logger.info(`⭐️ updateMenu done: ${position}`)
}
