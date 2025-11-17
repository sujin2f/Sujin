export type T_Token = {
    _id: string
    token?: string
    admin: boolean
}

export type T_User = Omit<T_Token, 'token'> & {
    email: string
}

export type T_SessionUser = {
    gqlToken: string
    _id: string
    name: string
    email: string
    image?: string
}
