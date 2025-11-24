'use server'
import fetch from 'cross-fetch'
import { getRefreshToken, storeAccessToken } from '@lib/utils/server'

export const refresh = async (): Promise<undefined> => {
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
    }).then(async (response) => {
        if (response.status !== 200) {
            throw new Error()
        }

        const token = response.headers.get('authorization')
        if (!token) {
            throw new Error()
        }

        await storeAccessToken(token.slice(7))
    })
}
