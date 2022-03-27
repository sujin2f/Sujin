export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R

export type Nullable<T> = T | undefined

export type GlobalVariable = {
    title?: string
    excerpt?: string
    frontend?: string
    adClient?: string
    adSlot?: string
}
