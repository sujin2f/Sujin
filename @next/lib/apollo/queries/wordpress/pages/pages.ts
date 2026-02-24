'use server'
/* Models */
import { client } from '@lib/utils/apollo-client'
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import QUERY from '@lib/apollo/queries/wordpress/pages/pages-gql.graphql'
/* Utils */
import { getAuthHeader } from '@app/_lib/utils/tokens'
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
