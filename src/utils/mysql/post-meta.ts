import { OptionValue } from 'src/types/wordpress'
import { MySQLQuery } from 'src/constants/mysql-query'
import { MySQL } from 'src/utils/mysql/mysqld'
import { unserialize } from 'src/utils/wordpress'

type PostMeta = {
    meta_key: string
    meta_value: string
}
type PostMetaRecord = Record<string, string>

export const getPostMeta = async <T extends OptionValue>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const mysql = MySQL.getInstance()
    const value = await mysql.selectOne<PostMeta>(
        MySQLQuery.getPostMeta(postId, metaKey),
    )

    if (!value) {
        return defaultValue
    }

    return unserialize<T>(value.meta_value, defaultValue)
}

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
