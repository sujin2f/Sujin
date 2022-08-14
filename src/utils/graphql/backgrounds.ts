import { Image } from 'src/types/wordpress'
import { getBackgrounds } from 'src/utils/mysql/get-backgrounds'

export const backgrounds = async (): Promise<Image[]> => {
    return await getBackgrounds()
}
