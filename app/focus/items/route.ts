import { type NextRequest, NextResponse } from 'next/server'
/* CONSTANTS */
import query from '@app/focus/_lib/focusCloudItems.graphql'
import { COLLECTION } from '@common/constants'
/* Models */
import { Logger } from '@common/model/Logger'
import { client } from '@app/_lib/graphql/client'
/* T_Types */
import type { T_Focus_Message } from '@common/types'
/* Utils */
import { createAuthHeader } from '@common/utils/token'
import { gqlRequest } from '@app/_lib/utils/redis'
import { getToken } from '@app/focus/_lib/utils'

export async function GET(request: NextRequest) {
    const token = getToken(request)
    if (typeof token !== 'string') {
        return token
    }

    const email = request.headers.get('email')
    if (!email) {
        Logger.error('Focus cloud message list GET failed: email is not valid.')
        return NextResponse.json({ error: 'Your request has been failed due to unknown error.' }, { status: 406 }) // 406 Not Acceptable
    }

    const response: T_Focus_Message[] | NextResponse = await gqlRequest(
        async () =>
            await client
                .query<{ focusCloudItems: T_Focus_Message[] }>({
                    query,
                    context: createAuthHeader(token),
                    fetchPolicy: 'network-only',
                })
                .then((result) => {
                    if (!result.data) {
                        throw new Error('unknown error')
                    }
                    let list = result.data.focusCloudItems
                    if (!list || !list.length) {
                        list = [] as T_Focus_Message[]
                    }
                    Logger.log('Focus cloud message list GET attempted.', email, list.length)
                    return list
                }),
        `${COLLECTION.FOCUS_MESSAGE}-${email}`,
    ).catch((e) => {
        Logger.error(`Focus cloud message list GET failed: ${e.message}`)
        return NextResponse.json({ error: `Your request has been failed. Reason: ${e.message}` }, { status: 500 }) // 500 Internal Server Error
    })

    return Array.isArray(response)
        ? NextResponse.json({ result: response }, { status: response.length ? 200 : 404 })
        : response // 404 Not Found
}
