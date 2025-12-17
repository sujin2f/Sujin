'use server'
/* Utils */
import { gqlRequest } from '@app/_lib/redis'
/* CONSTANTS */
import query from '@app/_lib/graphql/getMenu-gql.graphql'
import { COLLECTION } from '@sujin/lib/constants'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { MenuItem } from '@sujin/lib/types/menu'

export const getMenu = async (slug: string): Promise<MenuItem[]> => {
    'use server'
    return await gqlRequest(
        async () =>
            await client
                .query<{ menu: MenuItem[] }>({ query, variables: { slug }, fetchPolicy: 'network-only' })
                .then((result) => {
                    if (!result.data) return []
                    return result.data.menu
                })
                .catch((e) => {
                    Logger.error(`🤬 Error fetching backgrounds ${JSON.stringify(e)}`)
                    return []
                }),
        `${COLLECTION.MENU}-${slug}`,
    ).catch(() => [])
}
