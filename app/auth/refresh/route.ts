/* Utils */
import { getAccessToken, refreshAccessToken, storeAccessToken } from '@app/_lib/utils/tokens'

/**
 * Refresh token from outside like Focus
 * @returns
 * @deprecated use auth.sujinc.com/refresh
 */
export async function POST(): Promise<Response> {
    await refreshAccessToken()
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
