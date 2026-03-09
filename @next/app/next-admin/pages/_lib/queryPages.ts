'use server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import query from './pages.graphql'
/* Utils */
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* T_Types */
import type { T_ArchivePost } from '@sujin/lib/types'

export const queryPages = async (page: number): Promise<{ items: T_ArchivePost[]; total: number }> => {
    'use server'
    Logger.info(`pages query requested! ${page}`)
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
