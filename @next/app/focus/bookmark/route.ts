import type { NextRequest } from 'next/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
import { client } from '@lib/utils/apollo-client'
/* CONSTANTS */
import CREATE from '@app/focus/_lib/createFocusBookmark.graphql'
import REMOVE from '@app/focus/_lib/removeFocusBookmark.graphql'
/* Utils */
import { createAuthHeader, getAuthHeader } from '@sujin/lib/utils/token'

export async function PUT(request: NextRequest) {
    Logger.info('🤞 Focus upload')
    const token = getAuthHeader(request.headers)
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
            Logger.error(`🤬 Focus upload failed, ${e.message}`)
            return false
        })

    return Response.json({ result })
}

export async function DELETE(request: NextRequest) {
    Logger.info('🤞 Focus remove')
    const token = getAuthHeader(request.headers)
    if (!token) {
        return Response.error()
    }
    const text = await request.text()
    const { id } = JSON.parse(text)

    const result = await client
        .mutate({
            mutation: REMOVE,
            variables: { id },
            context: createAuthHeader(token),
        })
        .then(() => true)
        .catch(() => false)

    return Response.json({ result })
}
