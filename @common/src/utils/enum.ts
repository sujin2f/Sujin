/**
 * Enum utility functions.
 * @deprecated Consider using TypeScript enums directly.
 */

/**
 * Gets the keys of an enum object (filters out numeric indices).
 * @param {Record<string, number | string>} target The enum object.
 * @returns {string[]} The enum keys.
 */
export const getEnumKeys = (
    target: Record<string, number | string>,
): string[] =>
    Object.keys(target).filter(
        (key) =>
            target[target[key]]?.toString() !== key || isNaN(parseInt(key, 10)),
    )

/**
 * Gets the values of an enum object.
 * @param {Record<string, number | string>} target The enum object.
 * @returns {(string | number)[]} The enum values.
 */
export const getEnumValues = (
    target: Record<string, number | string>,
): (string | number)[] => getEnumKeys(target).map((key) => target[key])

/**
 * Checks if a value exists in an enum.
 * @param {Record<string, number | string>} target The enum object.
 * @param {string | number} needle The value to search for.
 * @returns {boolean} True if the value exists in the enum.
 */
export const hasEnumValue = (
    target: Record<string, number | string>,
    needle: string | number,
): boolean => getEnumValues(target).includes(needle)

/**
 * Checks if a key exists in an enum.
 * @param {Record<string, number | string>} target The enum object.
 * @param {string} needle The key to search for.
 * @returns {boolean} True if the key exists in the enum.
 */
export const hasEnumKey = (
    target: Record<string, number | string>,
    needle: string,
): boolean => getEnumKeys(target).includes(needle)
