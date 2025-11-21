/**
 * Mongo
 */
export type T_User = {
    _id: string
    admin: boolean
}

export type T_UserSub = T_User & {
    name: string
    picture: string
    email: string
}

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

/**
 * result of login mutation
 */
export type T_Token_Return = {
    _id: string // user id
    accessToken: string // Access token
}

/**
 * Token from Google login
 * for creating Access token
 */
export type T_NextToken = {
    name: string
    email: string
    picture?: string
}

/**
 * Next server session
 */
export type T_Session = {
    accessToken: string // Access token
    _id: string
    name: string
    email: string
    picture?: string
}
