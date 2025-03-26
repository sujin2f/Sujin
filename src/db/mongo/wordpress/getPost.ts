import { ObjectId, type WithId } from 'mongodb'
/* Models */
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
/* Constants */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { getPostBy } from '@src/db/mysql/getPostBy'
/* Types */
import type { Post } from '@src/types/wordpress'

const request = async (
    slug: string,
    type: 'post' | 'page',
    ignoreStatus: boolean,
): Promise<WithId<Post>> =>
    await Mongo.findOne<Post>('post', { slug, type }).catch(async () => {
        const post = await getPostBy('slug', slug, ignoreStatus)
        await Mongo.insertOne('post', post)
        return {
            ...post,
            _id: new ObjectId(),
        }
    })

export const getPost = async (
    slug: string,
    type: 'post' | 'page',
    ignoreStatus = false,
): Promise<WithId<Post>> => {
    const value = slug.toLowerCase()
    const key = `post-${value}`

    return await Cached.getInstance().getOrExecute(
        key,
        async () => await request(value, type, ignoreStatus),
        WEEK_IN_SECONDS,
    )
}
