import type { ConstToType } from '@common/types'
import type { T_User } from './user'
import type { WithId } from 'mongodb'

export const UNITS = [
    'kg',
    'g',
    'ml',
    'l',
    'tbsp',
    'tsp',
    'cup',
    'oz',
    'lb',
    'ea',
] as const
export type UNITS = ConstToType<typeof UNITS>

export type T_Recipe = WithId<{
    title: string
    url: string
    search: string
    ingredients: { title: string; amount: number; unit: UNITS }[]
    user: T_User
}>
