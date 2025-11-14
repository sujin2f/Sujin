export type T_User = {
    _id: string
    email: string
    admin: boolean
}

export type T_SessionUser = {
    gqlToken: string
    name: string
    email: string
    image?: string
}
