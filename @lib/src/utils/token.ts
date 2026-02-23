import jwt from 'jsonwebtoken'
/* Utils */
import { decodeText, encodeText } from '@sujin/share/utils/crypto'
/* T_Types */
import type { T_Token } from '../types'
/* CONSTANTS */
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { HEADER_PREFIX, HEADER_TOKEN } from '../constants'

export const generateToken = async (_sub: unknown, lifetime: number, secret: string, cryptoKey: string) => {
    const iat = Math.trunc(new Date().getTime() / SECOND_IN_MS)
    const sub = await encodeText(JSON.stringify(_sub), cryptoKey)
    const payload: T_Token = {
        iss: 'https://sujinc.com',
        iat,
        exp: iat + lifetime,
        sub,
    }
    return jwt.sign(payload, secret)
}

export const getExpiration = (token: string) => {
    const decoded = jwt.decode(token)
    if (!decoded || typeof decoded === 'string' || !decoded.exp) {
        return
    }
    return decoded.exp
}

export const getTokenSub = async <T>(token: string, cryptoKey: string): Promise<T> => {
    const decoded = jwt.decode(token)
    if (!decoded || typeof decoded === 'string' || !decoded.sub) {
        throw new Error('🤬 Token is not valid!')
    }
    const sub = await decodeText(decoded!.sub, cryptoKey)
    return JSON.parse(sub) as T
}

export const verifyToken = async <T>(token: string, secret: string, cryptoKey: string): Promise<T> => {
    jwt.verify(token, secret)
    return await getTokenSub(token, cryptoKey)
}

export const addHeaderPrefix = (token: string) => {
    return `${HEADER_PREFIX}${token}`
}

export const removeHeaderPrefix = (token: string) => {
    return token.slice(HEADER_PREFIX.length)
}

export const createAuthHeader = (token: string) => {
    return { headers: { [HEADER_TOKEN]: addHeaderPrefix(token) } }
}

export const getAuthHeader = (headers: { get: (key: string) => string | null }) => {
    const token = headers.get(HEADER_TOKEN)
    if (!token) {
        throw new Error('Token does not exist')
    }
    return removeHeaderPrefix(token)
}
