export type WithCache<T> = T & {
    expired: number
}

export const removeId = <T>(item: T): T => {
    return {
        ...item,
        ['_id']: undefined,
    } as T
}
