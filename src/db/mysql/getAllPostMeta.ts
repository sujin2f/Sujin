'use server'

import { MySQLQuery } from '@src/constants/mysql-query'
import MySQL from '@src/db/mysql'
import type { PostMeta } from '@src/types/wordpress'

type PostMetaRecord = Record<string, string>

export const getAllPostMeta = async (
    postId: number,
): Promise<PostMetaRecord> => {
    const query = MySQLQuery.getAllPostMeta(postId)
    const result = await MySQL.getInstance().select<PostMeta>(query)

    return result.reduce((acc: PostMetaRecord, meta) => {
        return {
            ...acc,
            [meta.meta_key]: meta.meta_value,
        }
    }, {})
}
