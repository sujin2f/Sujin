export type ConstToType<T> = T[keyof T]

export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R
export type Nullable<T> = T | undefined
export const QuantumBool = {
    FALSE: false,
    MOD: 0.5,
    TRUE: true,
} as const
export type QuantumBool = ConstToType<typeof QuantumBool>

