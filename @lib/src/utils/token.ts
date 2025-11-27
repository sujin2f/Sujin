import jwt from 'jsonwebtoken'
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { decodeText, encodeText } from '@sujin/share/utils/crypto'
import type { T_Token } from '../types'

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
