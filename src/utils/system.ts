import {
    MenuDefault,
    MenuDevTool,
    MenuEther,
    MenuEtherKor,
} from '@src/constants/menu'
import { MenuNames } from '@src/constants/mysql-query'
import type { Nullable } from '@common/types'
import type { MenuItem } from '@src/types/wordpress'

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
