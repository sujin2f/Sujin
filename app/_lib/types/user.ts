import type { WithId } from 'mongodb'

export type T_User = WithId<{
    name: string
    email: string
    image: string
}>
