import { ConstToType } from '@common/types'
import type { T_User } from './user'
import type { WithId } from 'mongodb'

const UNITS_WEIGHT = ['g', 'kg', 'lb']
const UNITS_VOLUMES = ['ml', 'l', 'oz']
const UNITS_MEASURE = ['tbsp', 'tsp', 'cup']
export const UNITS = [
    ...UNITS_WEIGHT,
    ...UNITS_VOLUMES,
    ...UNITS_MEASURE,
    'ea',
] as const
export type UNITS = ConstToType<typeof UNITS>

export const UNITS_SELECTION = {
    weight: UNITS_WEIGHT,
    volume: UNITS_VOLUMES,
    measure: UNITS_MEASURE,
    ea: 'ea',
}

export type T_Recipe = WithId<{
    title: string
    url: string
    search: string
    ingredients: { title: string; amount: number; unit: UNITS }[]
    user: T_User
}>
