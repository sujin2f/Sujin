import {
    MenuDefault,
    MenuDevTool,
    MenuEther,
    MenuEtherKor,
} from '@app/helpers/constants/menu'
import { MenuNames } from '@app/helpers/constants/mysql-query'
import type { Nullable } from '@common/types'
import { ARCHIVE, type MenuItem } from '@app/helpers/types/wordpress'
import { COLLECTION } from '@app/helpers/constants/mongo'
import { VERSION } from '@common/constants/helper'

export const getMenuNameFromPath = (path: Nullable<string>) => {
    if (!path) {
        return MenuNames.MAIN
    }
    if (path.startsWith('/ether/for')) {
        return MenuNames.ETHER_KOR
    }
    if (path.startsWith('/ether')) {
        return MenuNames.ETHER
    }
    if (path.startsWith('/dev-tools')) {
        return MenuNames.DEV_TOOL
    }
    return MenuNames.MAIN
}

export const getMenu = (menu: MenuNames): MenuItem[] => {
    switch (menu) {
        case MenuNames.ETHER:
            return MenuEther
        case MenuNames.ETHER_KOR:
            return MenuEtherKor
        case MenuNames.DEV_TOOL:
            return MenuDevTool
        default:
            return MenuDefault
    }
}

/**
 *
 * @param {COLLECTION} collection
 * @param {string} slug
 * @returns {string}
 */
export const getCacheKey = (
    collection: COLLECTION | ARCHIVE,
    ...suffixes: (string | number)[]
): string => {
    const suffix = suffixes?.join('-')

    switch (collection) {
        case COLLECTION.POST:
            return `${VERSION}-post-${suffix}`
        case COLLECTION.PAGE:
            return `${VERSION}-page-${suffix}`
        case ARCHIVE.CATEGORY:
        case COLLECTION.CATEGORY:
            return `${VERSION}-category-${suffix}`
        case ARCHIVE.TAG:
        case COLLECTION.TAG:
            return `${VERSION}-tag-${suffix}`
        case COLLECTION.BACKGROUNDS:
            return `${VERSION}-backgrounds`
    }
    return ''
}
