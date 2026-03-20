/* Models */
import { Logger } from '@common/model/Logger'
import { MenuItem } from '@src/schema/menu'
/* Utils */
import { removeCache } from '@src/utils/redis/cache'
import { getMenuLocation, getMenuItems } from '@src/utils/wordpress/menu'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'

/**
 * Refresh a menu from WP REST.
 *
 * @param position
 */
export const updateMenu = async (position: string) => {
    await MenuItem.deleteMany({ position })
    const location = await getMenuLocation(position)
    const menu = await getMenuItems(location)

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
