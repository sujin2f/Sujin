'use server'
import fetch from 'cross-fetch'
import { getRefreshToken, storeAccessToken } from '@lib/utils/server'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

export const refresh = async (): Promise<undefined> => {
    Logger.info('🤟 refresh token start!')
    const refreshToken = await getRefreshToken()
    if (!refreshToken) {
        throw new Error()
    }

    const endpoint = `${process.env.NEXT_PUBLIC_GQL_ENDPOINT}`
    const body = {
        query: `
        mutation {
            refresh
            }`,
    }

    await fetch(endpoint, {
        method: 'POST',
        headers: { authorization: `Bearer ${refreshToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            if (response.status !== 200) {
                throw new Error()
            }

            const token = response.headers.get('authorization')
            if (!token) {
                throw new Error()
            }

            Logger.info('⭐️ refresh token done!')
            await storeAccessToken(token.slice(7))
        })
        .catch((e) => {
            Logger.error(`🤬 refresh token failed! ${JSON.stringify(e)}`)
            throw e
        })
}
