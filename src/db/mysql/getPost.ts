import { Post } from '@src/types/wordpress'
import { getPostsBy } from '@src/db/mysql/getPostsBy'
import { Logger } from '@common/model/Logger'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Cached } from '@common/model/Cached'

export const request = async (
    queryKey: 'id' | 'slug',
    queryValue: string | number,
    ignoreStatus = false,
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

export const getPost = async (_slug: string) => {
    const slug = _slug.toLowerCase()
    const key = `post-${slug}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request('slug', slug),
        WEEK_IN_SECONDS,
        process.env.NODE_ENV === 'development',
    )
}
