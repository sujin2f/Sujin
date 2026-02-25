import type { NextRequest } from 'next/server'
/* Utils */
import { getAccessToken, refreshAccessToken, storeAccessToken } from '@app/_lib/utils/tokens'
import { getAuthHeader } from '@sujin/lib/utils/token'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

/**
 * Refresh token from outside like Focus
 *
 * @param request
 * @returns
 */
export async function POST(request: NextRequest): Promise<Response> {
    Logger.info('Focus refresh token')
    const token = getAuthHeader(request.headers)
    if (!token) {
        return Response.error()
    }

    await refreshAccessToken(token)
    const response = await getAccessToken()
        .then(async (token) => {
            if (token) {
                await storeAccessToken(token)
            }
            return { token, result: true }
        })
        .catch(() => ({ result: false }))

    return Response.json(response)
}
