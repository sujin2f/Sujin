'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/pages/page.graphql'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

export const page = async (slug: string): Promise<T_Page> => {
    return await client
        .query<{ page: T_Page }>({
            query: QUERY,
            variables: { slug },
        })
        .then((result) => {
            if (!result.data) {
                const message = `🤬 Page ${slug} request has been failed: No-content.`
                throw new Error(message)
            }
            return result.data.page
        })
        .catch((e) => {
            Logger.error(JSON.stringify(e))
            throw e
        })
}
