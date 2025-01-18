'use client'

import fetchGQL from '@common/graphql/fetchGQL'
import { menuOpr, queryMenu } from '@src/constants/graphql'
import { MenuDefault, MenuEther, MenuEtherKor } from '@src/constants/menu'
import { MenuNames } from '@src/constants/mysql-query'
import { MenuItem } from '@src/types/wordpress'
import { startTransition, useActionState, useEffect } from 'react'

const getMenu = (slug: string) => {
    if (slug === MenuNames.ETHER) {
        return new Promise<MenuItem[]>((resolve) => resolve(MenuEther))
    }

    if (slug === MenuNames.ETHER_KOR) {
        return new Promise<MenuItem[]>((resolve) => resolve(MenuEtherKor))
    }

    return fetchGQL(queryMenu, menuOpr, slug)
}

export const useMenu = (slug: string): MenuItem[] => {
    const [menu, setMenu] = useActionState(() => getMenu(slug), null)
    useEffect(() => {
        startTransition(() => setMenu())
    }, [])

    if (slug === MenuNames.MAIN && !menu) {
        return MenuDefault
    }

    return menu || []
}
