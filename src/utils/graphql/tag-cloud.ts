import { TagCloud } from 'src/types/wordpress'
import { getTagCloud } from 'src/utils/mysql/tag-cloud'

export const tagCloud = async (): Promise<TagCloud[]> => {
    return await getTagCloud()
}
