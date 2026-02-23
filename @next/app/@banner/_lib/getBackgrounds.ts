'use server'
/* Utils */
import { gqlRequest } from '@app/_lib/utils/redis'
/* CONSTANTS */
import query from '@app/@banner/_lib/getBackgrounds-gql.graphql'
import { COLLECTION } from '@sujin/lib/constants'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'

export const getBackgrounds = async () => {
    'use server'
    return await gqlRequest(
        async () =>
            await client
                .query<{ backgrounds: T_Background[] }>({ query, fetchPolicy: 'network-only' })
                .then((result) => {
                    if (!result.data) return []
                    return result.data.backgrounds
                })
                .catch((e) => {
                    Logger.error(`🤬 Error fetching backgrounds ${JSON.stringify(e)}`)
                    return []
                }),
        COLLECTION.BACKGROUNDS,
    ).catch(() => [])
}
