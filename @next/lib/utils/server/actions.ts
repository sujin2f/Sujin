'server-only'
/* Utils */
import { removeCache } from '@lib/redis'

export const flushCache = async () => {
    removeCache()
}
