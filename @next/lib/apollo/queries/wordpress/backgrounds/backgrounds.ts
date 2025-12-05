'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import BACKGROUND_LIST from '@lib/apollo/queries/wordpress/backgrounds/backgrounds.graphql'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'

export const backgrounds = async (): Promise<T_Background[]> => {
    'use server'
    return await client
        .query<{ backgrounds: T_Background[] }>({ query: BACKGROUND_LIST, fetchPolicy: 'network-only' })
        .then((result) => {
            if (!result.data) return []
            return result.data.backgrounds
        })
        .catch((e) => {
            Logger.error(`🤬 Error fetching backgrounds ${JSON.stringify(e)}`)
            return []
        })
}
