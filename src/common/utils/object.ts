export const removeEmpty = (
    object: Record<string, unknown>,
): Record<string, unknown> =>
    Object.keys(object)
        .filter((key) => {
            if (
                object[key] &&
                typeof object[key] === 'object' &&
                !Object.keys(object[key] as Record<string, unknown>).length
            ) {
                return false
            }
            return object[key]
        })
        .reduce((acc, key) => ({ ...acc, [key]: object[key] }), {})

export const isEmpty = (
    value: Record<string, unknown> | string | number | unknown[] | null,
): boolean => {
    if (value === undefined || value === null || value === NaN) {
        return true
    }
    if (typeof value === 'string') {
        return value === ''
    }
    if (Array.isArray(value)) {
        return value.length === 0
    }
    return Object.keys(value).length === 0
}
