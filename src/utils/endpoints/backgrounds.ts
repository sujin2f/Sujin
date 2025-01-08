import { Image } from '@project/types/wordpress'
import { getBackgrounds } from '@utils/mysql/media'
import { Cached } from '@common/model/Cached'

export const backgrounds = async (): Promise<Image[]> => {
    const cacheKey = `backgrounds`
    const cache = Cached.getInstance()
    return await cache.getOrExecute<Image[]>(cacheKey, async () => {
        return await getBackgrounds()
    })
}
