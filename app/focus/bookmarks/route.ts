import type { NextRequest } from 'next/server'
/* CONSTANTS */
import query from '@app/focus/_lib/focusBookmarks.graphql'
import { COLLECTION } from '@common/constants'
/* Models */
import { Logger } from '@common/model/Logger'
import { client } from '@app/_lib/graphql/client'
/* T_Types */
import type { T_Focus_Message } from '@common/types'
/* Utils */
import { createAuthHeader, getTokenFromHeader } from '@common/utils/token'
import { gqlRequest } from '@app/_lib/utils/redis'

export async function GET(request: NextRequest) {
    Logger.info('Focus list GET from old Browser')

    const token = getTokenFromHeader(request.headers)
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
        Logger.error(`Focus list GET from old Browser failed: ${e.message}`)
        return [] as T_Focus_Message[]
    })

    return Response.json(response)
}
