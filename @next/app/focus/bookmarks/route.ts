import type { NextRequest } from 'next/server'
/* CONSTANTS */
import query from '@app/focus/_lib/focusBookmarks.graphql'
import { COLLECTION } from '@sujin/lib/constants'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { client } from '@lib/utils/apollo-client'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* Utils */
import { createAuthHeader, getAuthHeader } from '@sujin/lib/utils/token'
import { gqlRequest } from '@app/_lib/utils/redis'

export async function GET(request: NextRequest) {
    Logger.info('🤞 Focus list bookmark')

    const token = getAuthHeader(request.headers)
    const email = request.headers.get('email')
    if (!token || !email) {
        return Response.error()
    }

    const response = await gqlRequest(
        async () =>
            await client
                .query<{ focusBookmarks: T_Focus_Message[] }>({
                    query,
                    context: createAuthHeader(token),
                    fetchPolicy: 'network-only',
                })
                .then((result) => {
                    if (!result.data || !result.data.focusBookmarks) {
                        throw new Error()
                    }
                    return result.data.focusBookmarks
                }),
        `${COLLECTION.BOOKMARK}-${email}`,
    ).catch((e) => {
        Logger.error(`🤬 Error fetching bookmarks: ${e.message}`)
        return [] as T_Focus_Message[]
    })

    return Response.json(response)
}
