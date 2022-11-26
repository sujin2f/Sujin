export const getEnumKeys = (
    target: Record<string, number | string>,
): string[] =>
    Object.keys(target).filter(
        (key) =>
            target[target[key]]?.toString() !== key || isNaN(parseInt(key)),
    )

export const getEnumValues = (
    target: Record<string, number | string>,
): (string | number)[] => getEnumKeys(target).map((key) => target[key])

export const hasEnumValue = (
    target: Record<string, number | string>,
    needle: string | number,
): boolean => getEnumValues(target).includes(needle)

export const hasEnumKey = (
    target: Record<string, number | string>,
    needle: string,
): boolean => getEnumKeys(target).includes(needle)
