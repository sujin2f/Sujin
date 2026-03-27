import type { NextRequest } from 'next/server'
/* Models */
import { Logger } from '@common/model/Logger'
import { client } from '@app/_lib/graphql/client'
/* CONSTANTS */
import CREATE from '@app/focus/_lib/createFocusBookmark.graphql'
import REMOVE from '@app/focus/_lib/removeFocusBookmark.graphql'
/* Utils */
import { createAuthHeader, getTokenFromHeader } from '@common/utils/token'
/* T_Types */
import type { T_Focus_Message } from '@common/types'

/**
 * @deprecated Backward compatibility
 */
export async function PUT(request: NextRequest) {
    Logger.info('Focus DELETE from old Browser')
    const token = getTokenFromHeader(request.headers)
    if (!token) {
        return Response.error()
    }
    const text = await request.text()
    const message = JSON.parse(text)

    const result = await client
        .mutate({
            mutation: CREATE,
            variables: {
                message,
            },
            context: createAuthHeader(token),
        })
        .then(() => true)
        .catch((e) => {
            Logger.error(`Focus DELETE from old Browser failed, ${e.message}`)
            return false
        })

    return Response.json({ result })
}

/**
 * @deprecated Backward compatibility
 */
export async function DELETE(request: NextRequest) {
    Logger.info('Focus DELETE from old Browser')
    const token = getTokenFromHeader(request.headers)
    if (!token) {
        return Response.error()
    }
    const text = await request.text()
    const { id } = JSON.parse(text)

    const result = await client
        .mutate<{ removeFocusBookmark: T_Focus_Message[] }>({
            mutation: REMOVE,
            variables: { id },
            context: createAuthHeader(token),
        })
        .then((result) => {
            if (!result.data || !result.data.removeFocusBookmark) {
                throw new Error()
            }
            return result.data.removeFocusBookmark
        })
        .catch((e) => {
            Logger.error(`Focus DELETE from old Browser failed, ${e.message}`)
            return []
        })

    return Response.json(result)
}
