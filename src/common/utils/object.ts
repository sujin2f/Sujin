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
