import type { WithId } from 'mongodb'

export type T_User = WithId<{
    email: string
    image: string
}>
