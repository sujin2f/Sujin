'use server'
import { client } from '@lib/apollo/apollo-client-server'
import BACKGROUND_LIST from '@lib/apollo/queries/wordpress/backgrounds/backgrounds.graphql'
import type { T_Background } from '@sujin/lib/types'

export const backgrounds = async (): Promise<T_Background[]> => {
    return await client
        .query<{ backgrounds: T_Background[] }>({ query: BACKGROUND_LIST })
        .then((result) => {
            if (!result.data) return []
            return result.data.backgrounds
        })
}
