export type Fn<T extends unknown[] = void[], R = void> = (...param: T) => R

export type Nullable<T> = T | undefined

export type GlobalVariable = {
    siteName?: string
    title?: string
    excerpt?: string
    image?: string
    url?: string
    frontend?: string
    adClient?: string
    adSlot?: string
    isProd?: boolean
    is404?: boolean
}
