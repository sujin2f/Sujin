import type { WithId } from 'mongodb'
import type { ConstToType } from '@common/types'
import { T_User } from './user'

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
]
export type UNITS = ConstToType<typeof UNITS>

export type T_Recipe = WithId<{
    title: string
    url: string
    ingredients: string
    recipe: { title: string; amount: number; unit: UNITS }[]
    user: T_User
}>
