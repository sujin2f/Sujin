export type T_User = {
    email: string
    admin: boolean
}

export type T_SessionUser = {
    gqlToken: string
    name: string
    email: string
    image?: string
}
