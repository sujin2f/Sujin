import type { Binary, WithId } from 'mongodb'

export type T_User = WithId<{
    email: Binary
    name: Binary
    image: string
}>

export type T_SessionUser = {
    _id: string
    name: string
    email: string
    image?: string
}
