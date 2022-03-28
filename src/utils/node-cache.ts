import NodeCache from 'node-cache'
import { DAY_IN_SECONDS } from 'src/common'

export const cached = new NodeCache({
    stdTTL: parseInt(process.env.MYSQL_CACHE_TTL || `${DAY_IN_SECONDS}`, 10),
})
