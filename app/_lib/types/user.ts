import type { Binary, WithId } from 'mongodb'

export type T_User = WithId<{
    email: Binary
    name: Binary
    image: string
}>
