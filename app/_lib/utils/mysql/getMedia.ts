/* Utils */
import { getPostBy } from '@app/_lib/utils/mysql/getPostBy'
import { getMediaFromPost } from './getMediaFromPost'
/* CONSTANTS */
import { POST_TYPE, type T_ImageBlock } from '@app/_lib/types'
/* T_Types */
import type { Nullable } from '@sujin/common/types'

export const getMedia = async (
    postId: number,
): Promise<Nullable<T_ImageBlock>> => {
    const post = await getPostBy('id', postId, POST_TYPE.ATTACHMENT, true)
    if (!post) {
        return
    }

    return getMediaFromPost(post)
}
