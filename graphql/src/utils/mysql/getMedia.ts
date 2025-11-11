/* Utils */
import { getPostBy } from '@src/utils/mysql/getPostBy'
import { getMediaFromPost } from '@src/utils/mysql/getMediaFromPost'
/* CONSTANTS */
import { POST_TYPE, type T_ImageBlock } from '@lib/types'
/* T_Types */
import type { Nullable } from '@common/types'

export const getMedia = async (
    postId: number,
): Promise<Nullable<T_ImageBlock>> => {
    const post = await getPostBy('id', postId, POST_TYPE.ATTACHMENT, true)
    if (!post) {
        return
    }

    return getMediaFromPost(post)
}
