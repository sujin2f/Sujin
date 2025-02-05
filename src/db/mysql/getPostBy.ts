import { Cached } from '@common/model/Cached'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Logger } from '@common/model/Logger'
import type { Post } from '@src/types/wordpress'

const request = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    ignoreStatus: boolean,
): Promise<Post> => {
    Logger.server(
        `Access MySQL for getting post key: ${queryKey} and value: ${queryValue}.`,
    )
    return await getPostsBy(queryKey, queryValue, 1, ignoreStatus).then(
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

export const getPostBy = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    ignoreStatus = false,
) => {
    let value = queryValue
    if (typeof queryValue === 'string') {
        value = queryValue.toLowerCase()
    }
    const key = `post-${value}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(queryKey, value, ignoreStatus),
    )
}
