'use server'
/* Utils */
import { getAuthHeader } from '@app/_lib/utils/tokens'
/* CONSTANTS */
import query from '@app/next-admin/focus/_lib/focusDevices.graphql'
/* T_Types */
import type { T_Focus_Device } from '@sujin/lib/types'

export const getDevices = async (page: number): Promise<{ items: T_Focus_Device[]; total: number }> => {
    'use server'
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
            if (!json.data?.focusDevices) return { items: [], total: 0 }

            const pages = response.headers.get('total-pages')
            return { items: json.data.focusDevices, total: parseInt(pages || '0') }
        })
        .catch(() => {
            return { items: [], total: 0 }
        })
}
