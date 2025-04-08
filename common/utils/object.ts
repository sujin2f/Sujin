/**
 * Remove empty nodes
 */
export const filterEmpty = (
    object: Record<string, unknown>,
): Record<string, unknown> =>
    Object.keys(object)
        .filter((key) => {
            if (isEmpty(object[key])) {
                return false
            }
            return object[key]
        })
        .reduce((acc, key) => ({ ...acc, [key]: object[key] }), {})

/**
 * Check given value is empty
 * Zero is not empty. Only NaN is empty.
 */
export const isEmpty = <T>(value: T): boolean => {
    if (value === undefined || value === null) {
        return true
    }
    if (typeof value === 'function') {
        return false
    }
    if (typeof value === 'boolean') {
        return false
    }
    if (typeof value === 'string') {
        return value === ''
    }
    if (typeof value === 'number') {
        return isNaN(value)
    }
    if (Array.isArray(value)) {
        return value.filter((v) => !isEmpty(v)).length === 0
    }
    // Check if {}
    if (typeof value === 'object') {
        return Object.keys(value).length === 0
    }
    return !!value
}

export const sort = <T extends Record<string, U>, U>(
    object: T,
    func: (key: string, value: U) => number,
): T =>
    Object.entries(object)
        .sort(
            ([aKey, aValue], [bKey, bValue]) =>
                func(aKey, aValue) - func(bKey, bValue),
        )
        .reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: value,
            }),
            {} as T,
        )

type MongoObject<T> = T & {
    _id: unknown
}
/**
 * @deprecated
 */
export const mongoIdToString = <T>(...object: MongoObject<T>[]) => {
    return object.map(
        (item) =>
            ({
                ...item,
                _id: `${item._id}`,
            } as T),
    )
}

export const omit = <T>(
    obj: Record<string, T>,
    ...target: string[]
): Record<string, T> => {
    const [key, ...keys] = target
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = obj

    if (keys.length === 0) {
        return rest
    }
    return omit(rest, ...keys)
}

export const keys = <T extends string | number | symbol>(
    object: Partial<Record<T, unknown>>,
): T[] => {
    return Object.keys(object) as T[]
}

/**
 * Object.entries does not support typing
 * It makes key as string
 *
 * @example
 * type Keys = 'id' | 'title'
 * const data: Record<Keys, string> = {
 *     id: 'string',
 *     title: 'string'
 * }
 * Object.entries(data).map(([key, value]) => {}) // key is string
 * entries(data).map(([key, value]) => {}) // key is 'id' | 'title'
 */
export const entries = <T extends string | number | symbol, U>(
    object: Partial<Record<T, U>>,
): [T, U][] => {
    return Object.entries(object) as [T, U][]
}
