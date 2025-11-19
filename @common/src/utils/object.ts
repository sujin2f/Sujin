/**
 * Filters out empty values from an object.
 * @param {Record<string, unknown>} object The object to filter.
 * @returns {Record<string, unknown>} A new object with empty values removed.
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
 * Checks if a value is empty.
 * Zero is not considered empty. Only NaN is empty for numbers.
 * @param {T} value The value to check.
 * @returns {boolean} True if the value is empty.
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
    if (value instanceof Date) {
        return false
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

/**
 * Sorts an object's keys using a comparator function.
 * @template T The type of the object.
 * @template U The type of the values.
 * @param {T} object The object to sort.
 * @param {(key: string, value: U) => number} func The comparator function.
 * @returns {T} A new object with sorted keys.
 */
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
 * Converts MongoDB ObjectId to string.
 * @deprecated This function is deprecated.
 * @template T The type of the object.
 * @param {...MongoObject<T>[]} object The MongoDB objects.
 * @returns {T[]} Array of objects with string IDs.
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

/**
 * Omits specified keys from an object.
 * @template T The type of the object values.
 * @param {Record<string, T>} obj The object to filter.
 * @param {...string[]} target The keys to omit.
 * @returns {Record<string, T>} A new object without the omitted keys.
 */
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

/**
 * Gets the keys of an object with proper typing.
 * @template T The type of keys.
 * @param {Partial<Record<T, unknown>>} object The object.
 * @returns {T[]} The object keys.
 */
export const keys = <T extends string | number | symbol>(
    object: Partial<Record<T, unknown>>,
): T[] => {
    return Object.keys(object) as T[]
}

/**
 * Gets entries of an object with proper typing.
 * Object.entries does not support typing and returns string keys.
 * This function preserves the key types.
 * @template T The type of keys.
 * @template U The type of values.
 * @param {Partial<Record<T, U>>} object The object.
 * @returns {[T, U][]} The object entries.
 * @example
 * type Keys = 'id' | 'title'
 * const data: Record<Keys, string> = { id: 'string', title: 'string' }
 * Object.entries(data).map(([key, value]) => {}) // key is string
 * entries(data).map(([key, value]) => {}) // key is 'id' | 'title'
 */
export const entries = <T extends string | number | symbol, U>(
    object: Partial<Record<T, U>>,
): [T, U][] => {
    return Object.entries(object) as [T, U][]
}
