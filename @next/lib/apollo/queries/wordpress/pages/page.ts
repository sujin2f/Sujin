'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/pages/page.graphql'
import { IS_DEV } from '@sujin/share/constants/helper'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'

export const page = async (slug: string): Promise<T_Page> => {
    return await client
        .query<{ page: T_Page }>({
            query: QUERY,
            variables: { slug },
            fetchPolicy: IS_DEV ? 'network-only' : 'cache-first',
        })
        .then((result) => {
            if (!result.data) {
                const message = `🤬 Page ${slug} request has been failed: No-content.`
                throw new Error(message)
            }
            Logger.info(`⭐️ page query done! ${slug}`)
            return result.data.page
        })
        .catch((e) => {
            Logger.error(JSON.stringify(e))
            throw e
        })
}
