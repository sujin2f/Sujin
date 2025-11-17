export const UNITS_WEIGHT = ['g', 'kg', 'lb'] as const
export const UNITS_VOLUMES = ['ml', 'l', 'oz', 'tbsp', 'tsp', 'cup'] as const
export const UNITS = [...UNITS_WEIGHT, ...UNITS_VOLUMES, 'ea'] as const
export type UNITS = (typeof UNITS)[number]

export const CONVERT_WEIGHT: Record<(typeof UNITS_WEIGHT)[number], number> = {
    g: 1,
    kg: 1000,
    lb: 453.592,
}
export const CONVERT_VOLUMES: Record<(typeof UNITS_VOLUMES)[number], number> = {
    ml: 1,
    l: 1000,
    oz: 29.5735,
    tbsp: 15,
    tsp: 5,
    cup: 236.59,
}

export const UNITS_SELECTION = {
    weight: UNITS_WEIGHT,
    volume: UNITS_VOLUMES,
    ea: 'ea',
}

export type T_Recipe = {
    _id: string
    title: string
    url?: string
    search: string
    ingredients: { title: string; amount: number; unit: UNITS }[]
    user: string
}
