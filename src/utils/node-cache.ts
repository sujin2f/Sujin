import NodeCache from 'node-cache'
import { Seconds } from 'src/constants'

export const cached = new NodeCache({
    stdTTL: parseInt(process.env.MYSQL_CACHE_TTL || `${Seconds.DAY}`),
})
