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
