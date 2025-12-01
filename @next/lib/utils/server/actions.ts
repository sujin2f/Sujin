'server-only'
/* Utils */
import { removeCache } from '@lib/utils/redis'

export const flushCache = async () => {
    removeCache()
}
