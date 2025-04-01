/* Models */
import Logger from '@common/model/Logger'
/* Utils */
import { getPostsBy } from '@src/db/mysql/getPostsBy'
/* Types */
import type { Post, PostType } from '@src/types/wordpress'

const getPostBy = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    type: PostType,
    ignoreStatus = false,
): Promise<Post> => {
    Logger.server(
        `Access MySQL for getting post key: ${queryKey} and value: ${queryValue}.`,
    )
    return await getPostsBy(queryKey, type, queryValue, 1, ignoreStatus).then(
        (result) => {
            if (!result[0]) {
                throw Error(
                    `Fail to get post with queryKey: ${queryKey} and queryValue ${queryValue}`,
                )
            }
            return result[0]
        },
    )
}

export default getPostBy
