/* istanbul ignore file */
export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R

export type Nullable<T> = T | undefined
