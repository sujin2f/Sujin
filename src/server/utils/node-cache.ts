import NodeCache from 'node-cache'
import { DAY_IN_SECONDS } from 'src/constants/datetime'

export const cached = new NodeCache({
    stdTTL: DAY_IN_SECONDS,
})
