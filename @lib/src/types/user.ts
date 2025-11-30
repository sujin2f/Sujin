import type { JwtPayload } from 'jsonwebtoken'

/**
 * Mongo
 */
export type T_User = {
    _id: string
    admin: boolean
}

/**
 * User info from Google
 */
export type T_GoogleUser = {
    name: string
    email: string
    picture: string
}

/**
 * User info in tokens
 */
export type T_UserSub = T_User & T_GoogleUser

/**
 * Token content
 */
export type T_Token = JwtPayload & {
    iss: string
    iat: number
    exp: number
    sub: string
}

/**
 * Token content: parsed sub
 * // TODO remove
 */
export type T_Parsed_Token = Omit<T_Token, 'sub'> & {
    sub: T_UserSub
}
