import type { Image } from 'src/types'
import { getBackgrounds } from 'src/utils/mysql/get-backgrounds'

export const backgrounds = async (): Promise<Image[]> => {
    return await getBackgrounds()
}
