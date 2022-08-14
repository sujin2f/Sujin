import NodeCache from 'node-cache'

export const cached = new NodeCache({
    stdTTL: parseInt(process.env.MYSQL_CACHE_TTL || '0', 10),
})
