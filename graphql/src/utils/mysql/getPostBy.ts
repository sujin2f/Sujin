/* Models */
import { FetchError } from '@sujin/common/model/Error'
/* CONSTANTS */
import { type POST_TYPE, type T_MySQLPost } from '@sujin/lib/types'
/* Utils */
import { getPostsBy } from '@src/utils/mysql/getPostsBy'

export const getPostBy = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    type: POST_TYPE,
    ignoreStatus = false,
): Promise<T_MySQLPost> => {
    return await getPostsBy(queryKey, type, queryValue, 1, ignoreStatus).then(
        (result) => {
            if (!result[0])
                throw new FetchError(
                    `Failed to find MySQL post with: ${queryKey}, ${queryValue}, and ${type}`,
                )
            return result[0]
        },
    )
}
