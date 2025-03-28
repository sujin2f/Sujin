'use server'

import type { OptionValue, PostMeta } from '@src/types/wordpress'
import { MySQLQuery } from '@src/constants/mysql-query'
import MySQL from '@src/db/mysql'
import { unserialize } from '@src/utils/wordpress'

export const getPostMeta = async <T extends OptionValue>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const mysql = MySQL.getInstance()
    const value = await mysql
        .selectOne<PostMeta>(MySQLQuery.getPostMeta(postId, metaKey))
        .catch(() => undefined)

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}
