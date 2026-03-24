'use server'
/* Models */
import { Logger } from '@common/model/Logger'
/* CONSTANTS */
import query from '@app/next-admin/posts/_lib/posts.graphql'
/* Utils */
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* T_Types */
import type { T_ArchivePost } from '@common/types'

export const queryPosts = async (page: number): Promise<{ items: T_ArchivePost[]; total: number }> => {
    'use server'
    Logger.info(`posts query requested! ${page}`)
    const context = await getAuthHeader()
    context.headers.page = page
    return await fetch(`${process.env.GQL_BASE_URL}`, {
        method: 'POST',
        headers: {
            ...context.headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `${query.loc?.source.body}`, variables: { page } }),
    })
        .then(async (response) => {
            const json = await response.json()
            if (!json.data?.pages) return { items: [], total: 0 }

            const pages = response.headers.get('total-pages')
            return { items: json.data.pages, total: parseInt(pages || '0') }
        })
        .catch(() => {
            return { items: [], total: 0 }
        })
}
