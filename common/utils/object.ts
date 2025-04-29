import { IOError } from '../model/Error'

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

type T_Object = Record<string, unknown>

const objectFormatter = (input: T_Object, schema: T_Object): T_Object => {
    if (!schema.properties) {
        throw new IOError(
            'Object schema does not have properties',
            schema,
        ).setCause(objectFormatter)
    }

    const formatted: T_Object = {}
    const keys = Object.keys(input)
    Object.entries(schema.properties).forEach(([key, value]) => {
        if (keys.includes(key) && !isEmpty(input[key])) {
            const result = schemaFormatter(
                input[key] as T_Object,
                value as T_Object,
            )
            if (!isEmpty(result)) formatted[key] = result
        }
    })

    if (schema.required && Array.isArray(schema.required)) {
        schema.required.forEach((key) => {
            if (!Object.keys(formatted).includes(key)) {
                throw new IOError(
                    `Required filed ${key} is missing`,
                    schema,
                ).setCause(objectFormatter)
            }
        })
    }

    return formatted
}

const filterEnum = (input: number | string, schema: T_Object) => {
    const enumValues = schema.enum
    if (enumValues && Array.isArray(enumValues))
        return enumValues.includes(input) ? input : null
    return input
}

export const schemaFormatter = (
    input: T_Object | number | string | Date | T_Object[],
    schema: T_Object,
): unknown => {
    switch (schema.bsonType) {
        case 'object':
            if (typeof input === 'object' && !(input instanceof Date))
                return objectFormatter(input as T_Object, schema)

        case 'array':
            return Array.isArray(input) && Object.keys(schema).includes('items')
                ? input.map((item) =>
                      schemaFormatter(
                          item,
                          schema.items as unknown as T_Object,
                      ),
                  )
                : null

        case 'int':
            if (typeof input !== 'object' && !Array.isArray(input))
                return typeof input === 'number'
                    ? filterEnum(input, schema)
                    : filterEnum(parseInt(input), schema)

        case 'string':
            return typeof input === 'string' ? filterEnum(input, schema) : null

        case 'date':
            return input instanceof Date ? input : null

        case 'bool':
            return typeof input === 'boolean' ? input : null

        case 'objectId':
            return input

        default:
            return input
    }

    return {}
}
