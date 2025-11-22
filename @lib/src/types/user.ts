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
 * Access token
 */
export type T_Token = {
    iss: string
    iat: number
    exp: number
    sub: string // JSON.stringify(user: T_UserSub)
}

/**
 * Access token
 */
export type T_Parsed_Token = {
    iss: string
    iat: number
    exp: number
    sub: T_UserSub
}
