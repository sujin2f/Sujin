import { createClient } from 'redis'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { ARCHIVE, POST_TYPE } from '@sujin/lib/constants'
/* Utils */
import { connectToDatabase } from '@src/utils/mongo/connection'
import { updateHits } from '@src/utils/redis/actions/updateHits'
import { flushDB } from '@src/utils/redis/actions/flushDB'
import { updateCategory } from '@src/utils/redis/actions/updateCategory'
import { removeCategory } from '@src/utils/redis/actions/removeCategory'
import { refreshBackgrounds } from '@src/utils/redis/actions/refreshBackgrounds'
import { updatePage } from '@src/utils/redis/actions/updatePage'
import { removePage } from '@src/utils/redis/actions/removePage'
import { updatePost } from '@src/utils/redis/actions/updatePost'
import { updatePostsByCategory } from '@src/utils/redis/actions/updatePostsByCategory'
import { updatePosts } from '@src/utils/redis/actions/updatePosts'
import { removeCache } from '@src/utils/redis/cache'
/* T_Types */
import type { RedisMessageWordpress } from '@sujin/lib/types'
;(async () => {
    const subscriber = await createClient({
        url: `redis://${process.env.REDIS_ENDPOINT}`,
    })
        .connect()
        .catch((e) => {
            Logger.error(
                `🤬 Redis.createClient() failed to connect from subscriber ${process.env.REDIS_ENDPOINT}, ${e.message}`,
            )
            throw e
        })

    if (!subscriber || !subscriber.isReady) {
        return
    }

    await connectToDatabase().catch((e) => Logger.error(e))
    Logger.info(`🚀 Redis subscriber launched!`)

    // Update Hit
    await subscriber.subscribe('update-hits', async (message) => {
        const slugs: string[] = JSON.parse(message)
        await updateHits(slugs)
    })

    // Flush DB
    await subscriber.subscribe('flush', async () => {
        await flushDB()
    })

    // Flush DB
    await subscriber.subscribe('flush-cache', async () => {
        await removeCache()
    })

    // Background
    await subscriber.subscribe('backgrounds', async () => {
        await refreshBackgrounds()
    })

    // Category / Page / Post
    await subscriber.subscribe('wordpress', async (message) => {
        const { type, action, slug, page }: RedisMessageWordpress = JSON.parse(message)
        switch (type) {
            case ARCHIVE.CATEGORY:
                if (action === 'update') {
                    if (page && slug) {
                        await updatePostsByCategory(slug, page)
                        return
                    }
                    if (page && !slug) {
                        await updatePosts(page)
                        return
                    }
                    if (!page && slug) {
                        await updateCategory(slug)
                        return
                    }
                    return
                }
                if (action === 'remove') {
                    await removeCategory(slug)
                    return
                }
                return
            case POST_TYPE.PAGE:
                if (action === 'update') {
                    await updatePage(slug)
                    return
                }
                if (action === 'remove') {
                    await removePage(slug)
                    return
                }
                return
            case POST_TYPE.POST:
                if (action === 'update') {
                    await updatePost(slug)
                    return
                }
                return
        }
    })
})()
