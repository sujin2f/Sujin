import { Image } from '@src/types/wordpress'
import { getBackgrounds } from '@src/utils/mysql/media'
import { Cached } from '@src/common/model/Cached'

export const backgrounds = async (): Promise<Image[]> => {
    const cacheKey = `backgrounds`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<Image[]>(cacheKey, async () => {
        return await getBackgrounds()
    })
}
