import { createClient } from 'redis'
import { Logger } from '@sujin/share/model/Logger'
import { connectToDatabase } from '@src/utils/mongo/connection'
import { updateHits } from '@src/subscriber/updateHits'
;(async () => {
    await connectToDatabase().catch((e) => Logger.error(e))
    Logger.info(`🚀 Redis subscriber launched!`)

    const subscriber = createClient({
        url: `redis://${process.env.REDIS_ENDPOINT}`,
    })
    await subscriber.connect()

    // Update Hit
    await subscriber.subscribe('updateHit', async (message) => {
        const slugs: string[] = JSON.parse(message)
        await updateHits(slugs)
    })
})()
