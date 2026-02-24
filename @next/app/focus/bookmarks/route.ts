import type { NextRequest } from 'next/server'
/* CONSTANTS */
import query from '@app/focus/_lib/focusBookmarks.graphql'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { client } from '@lib/utils/apollo-client'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* Utils */
import { createAuthHeader, getAuthHeader } from '@sujin/lib/utils/token'

export async function GET(request: NextRequest) {
    Logger.info('🤞 Focus list bookmark')
    const token = getAuthHeader(request.headers)
    if (!token) {
        return Response.error()
    }

    const response = await client
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
        })
        .catch(() => [] as T_Focus_Message[])

    return Response.json(response)
}
