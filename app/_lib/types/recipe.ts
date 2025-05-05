import type { T_User } from './user'
import type { WithId } from 'mongodb'

export const UNITS_SELECTION = {
    weight: {
        g: 'g',
        kg: 'kg',
        lb: 'lb',
    },
    volume: {
        ml: 'ml',
        l: 'l',
        oz: 'oz',
    },
    measure: {
        tbsp: 'tbsp',
        tsp: 'tsp',
        cup: 'cup',
    },
    ea: 'ea',
}
export const UNITS = [
    'g',
    'kg',
    'lb',
    'ml',
    'l',
    'oz',
    'tbsp',
    'tsp',
    'cup',
    'ea',
]

export type UNITS =
    | 'g'
    | 'kg'
    | 'lb'
    | 'ml'
    | 'l'
    | 'oz'
    | 'tbsp'
    | 'tsp'
    | 'cup'
    | 'ea'

export type T_Recipe = WithId<{
    title: string
    url: string
    search: string
    ingredients: { title: string; amount: number; unit: UNITS }[]
    user: T_User
}>
