'use server'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
/* CONSTANTS */
import query from '@app/_lib/graphql/query/menu.graphql'
import { COLLECTION } from '@sujin/lib/constants'
import { DEFAULT_MENUS } from '@lib/constants'
/* Models */
import { client } from '@app/_lib/graphql/client'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { MenuItem } from '@sujin/lib/types/menu'

export const getMenu = async (slug: string): Promise<MenuItem[]> => {
    'use server'
    const variables = { slug }
    const action = async () =>
        await client.query<{ menu: MenuItem[] }>({ query, variables, fetchPolicy: 'network-only' }).then((result) => {
            if (result.data?.menu.length) return DEFAULT_MENUS
            return result.data!.menu
        })

    return await gqlRequest(action, `${COLLECTION.MENU}-${slug}`).catch((e) => {
        Logger.error(`🤬 Error fetching backgrounds ${JSON.stringify(e)}`)
        return DEFAULT_MENUS
    })
}
