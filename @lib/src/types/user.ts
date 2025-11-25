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
export type T_Token = {
    iss: string
    iat: number
    exp: number
    sub: string // JSON.stringify(user: T_UserSub)
}

/**
 * Token content: parsed sub
 */
export type T_Parsed_Token = {
    iss: string
    iat: number
    exp: number
    sub: T_UserSub
}

/**
 * Token for temp validation of login
 */
export type T_Login_Token = {
    iss: string
    sub: string
}
