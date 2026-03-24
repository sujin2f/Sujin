import { type NextRequest, NextResponse } from 'next/server'
/* Models */
import { Logger } from '@common/model/Logger'
import { client } from '@app/_lib/graphql/client'
/* CONSTANTS */
import CREATE from '@app/focus/_lib/createFocusCloudItem.graphql'
import REMOVE from '@app/focus/_lib/removeFocusCloudItem.graphql'
/* Utils */
import { createAuthHeader } from '@common/utils/token'
import { getToken } from '@app/focus/_lib/utils'

export async function PUT(request: NextRequest): Promise<NextResponse> {
    const token = getToken(request)
    if (typeof token !== 'string') {
        return token
    }

    const text = await request.text()
    let message = null
    try {
        message = JSON.parse(text)
    } catch {}
    if (!message || !message.type) {
        Logger.error('Focus cloud message PUT failed: message is not valid: ', message)
        return NextResponse.json({ error: 'Your request has been failed due to unknown error.' }, { status: 406 }) // 406 Not Acceptable
    }

    return await client
        .mutate<{ createFocusCloudItem: string }>({
            mutation: CREATE,
            variables: { message },
            context: createAuthHeader(token),
        })
        .then((response) => {
            if (!response.data) {
                throw new Error('unknown error')
            }
            if (response.data?.createFocusCloudItem !== 'ok') {
                Logger.error('Focus cloud message duplicated')
                return NextResponse.json(
                    { message: 'Your already have this item on cloud.', id: response.data.createFocusCloudItem },
                    { status: 409 },
                ) // 409 Conflict
            }
            Logger.log('Focus cloud message PUT attempted.', message.type, message.title)
            return NextResponse.json(
                { message: 'Your request has been executed. Please import from other Focus browser.' },
                { status: 200 },
            )
        })
        .catch((e) => {
            Logger.error(`Focus cloud message PUT failed: ${e.message}`)
            return NextResponse.json({ error: `Your request has been failed. Reason: ${e.message}` }, { status: 500 }) // 500 Internal Server Error
        })
}

export async function DELETE(request: NextRequest) {
    const token = getToken(request)
    if (typeof token !== 'string') {
        return token
    }
    const text = await request.text()
    let message = null
    try {
        message = JSON.parse(text)
    } catch {}
    if (!message || !message._id) {
        Logger.error('Focus cloud message DELETE failed: message is not valid: ', message)
        return NextResponse.json({ error: 'Your request has been failed due to unknown error.' }, { status: 406 }) // 406 Not Acceptable
    }

    return await client
        .mutate<{ removeFocusCloudItem: string }>({
            mutation: REMOVE,
            variables: { id: message._id },
            context: createAuthHeader(token),
        })
        .then((response) => {
            if (!response.data) {
                throw new Error('unknown error')
            }
            const result = response.data?.removeFocusCloudItem
            if (result === 'not-exist') {
                Logger.error('Focus cloud message DELETE failed', result)
                return NextResponse.json({ error: 'The item is not in your cloud.' }, { status: 404 }) // 404 Not Found
            }
            if (result !== 'ok') {
                throw new Error('unknown error')
            }
            Logger.log('Focus cloud message DELETE attempted.', message._id)
            return NextResponse.json({ message: 'Your request has been executed.' }, { status: 200 })
        })
        .catch((e) => {
            Logger.error(`Focus cloud message DELETE failed: ${e.message}`)
            return NextResponse.json({ error: `Your request has been failed. Reason: ${e.message}` }, { status: 500 }) // 500 Internal Server Error
        })
}
