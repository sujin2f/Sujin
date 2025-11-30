'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/pages/pages.graphql'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const pages = async (page: number): Promise<T_ArchivePost[]> => {
    Logger.info(`🤞 pages query requested! ${page}`)
    return await client
        .query<{ pages: T_ArchivePost[] }>({
            query: QUERY,
            variables: { page },
            context: await getAuthHeader(),
            fetchPolicy: 'network-only',
        })
        .then((result) => {
            if (!result.data) return []
            return result.data.pages
        })
}
