/**
 * Converts a const object to its value type.
 * @template T The const object type.
 */
export type ConstToType<T> = T[keyof T]

/**
 * A function type that accepts parameters and returns a value.
 * @template T The parameters array type.
 * @template R The return type.
 */
export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R

/**
 * A type that allows a value to be undefined, null, or void.
 * @template T The base type.
 */
export type Nullable<T> = T | undefined | null | void

/**
 * Quantum Boolean - A three-state boolean value (TRUE, FALSE, MOD).
 */
export const QuantumBool = {
    FALSE: false,
    MOD: 0.5,
    TRUE: true,
} as const

/**
 * The type of QuantumBool values.
 */
export type QuantumBool = ConstToType<typeof QuantumBool>
