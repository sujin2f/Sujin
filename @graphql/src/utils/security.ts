import jwt from 'jsonwebtoken'
/* Modules */
import Logger from '@src/utils/logger'
/* T_Types */
import type { T_Token } from '@sujin/lib/types'

/**
 * Verify given token from MongoDB user
 *
 * @param token
 * @returns {T_Token}
 * @throws
 *
 * if message is 'jwt expired', try re-validate token
 */
export const verifyToken = (gqlToken: string): T_Token => {
    if (!gqlToken) {
        throw new Error()
    }

    return jwt.verify(gqlToken, getSecret('gql')) as T_Token
}

/**
 * Verify given token is admin
 *
 * @param token
 * @returns
 * @throws
 */
export const verifyAdmin = (gqlToken: string, message: string) => {
    const user = verifyToken(gqlToken)
    if (!user || !user.admin) {
        Logger.error(`🤬 ${message}`)
        throw new Error(`🤬 ${message}`)
    }
}

export const getSecret = (type: 'next' | 'gql' | 'email'): string => {
    let secret = ''
    switch (type) {
        case 'next':
            secret = process.env.NEXTAUTH_SECRET || ''
            break
        case 'gql':
            secret = process.env.GQL_SECRET || ''
            break
        case 'email':
            secret = process.env.EMAIL_SECRET || ''
            break
    }

    if (!secret) {
        // TODO
        throw new Error()
    }
    return secret
}
