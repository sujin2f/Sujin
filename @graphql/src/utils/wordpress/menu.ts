/* Models */
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Page } from '@common/types'
/* CONSTANTS */
import { REST_MENU_LOCATIONS, REST_MENU_ITEMS } from '@common/constants'

export const getMenuLocation = async (position: string): Promise<number> => {
    const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_MENU_LOCATIONS}/${position}`
    return await fetch(requestURL, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST menu-location -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST menu-location -- ${requestURL}`)
        }
        const json = (await response.json()) as { menu: number }
        if (!json.menu) {
            Logger.error(`🤬 Failed to request REST menu-location -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST menu-location -- ${requestURL}`)
        }
        return json.menu
    })
}

export const getMenuItems = async (location: number): Promise<T_Page[]> => {
    const requestURL = `${process.env.WP_REST_BASE_URL}/${REST_MENU_ITEMS}/?menus=${location}`
    return await fetch(requestURL, {
        method: 'GET',
        cache: 'force-cache',
    }).then(async (response) => {
        if (response.status !== 200) {
            Logger.error(`🤬 Failed to request REST menu-items -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST menu-items -- ${requestURL}`)
        }
        const json = (await response.json()) as T_Page[]
        if (!json || !json.length) {
            Logger.error(`🤬 Failed to request REST menu-items -- ${requestURL}`)
            throw new Error(`🤬 Failed to request REST menu-items -- ${requestURL}`)
        }
        return json
    })
}
