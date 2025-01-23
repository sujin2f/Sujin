import type { WithId } from 'mongodb'

export const removeId = <T>(item: WithId<T>): T => {
    return {
        ...item,
        ['_id']: undefined,
    } as T
}
