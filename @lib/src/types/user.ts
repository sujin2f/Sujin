/**
 * Mongo
 */
export type T_User = {
    _id: string // user id
    email: string // hash string
}

/**
 * GQL token
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
    accessToken: string // GQL token
}

/**
 * Token from Google login
 * for creating GQL token
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
    accessToken: string // GQL token
    _id: string
    name: string
    email: string
    picture?: string
}
