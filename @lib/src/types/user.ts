/**
 * Mongo
 */
export type T_User = {
    _id: string // user id
    email: string // hash string
}

/**
 * Access token
 */
export type T_Token = {
    _id: string // user id
    email: string // hash string
    admin: boolean
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
