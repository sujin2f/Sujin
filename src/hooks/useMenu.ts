'use client'

import { MenuDefault, MenuEther, MenuEtherKor } from '@src/constants/menu'
import { MenuNames } from '@src/constants/mysql-query'
import { MenuItem } from '@src/types/wordpress'

export const useMenu = (slug: string): MenuItem[] => {
    if (slug === MenuNames.ETHER) {
        return MenuEther
    }

    if (slug === MenuNames.ETHER_KOR) {
        return MenuEtherKor
    }

    if (slug === MenuNames.MAIN) {
        return MenuDefault
    }

    return []
}
