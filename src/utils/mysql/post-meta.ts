import { MySQLQuery } from 'src/constants/mysql-query'
import { MySQL } from 'src/utils/mysql/mysqld'
import { isSerialized } from '../wordpress'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PHPUnserialize = require('php-unserialize')

type PostMeta = {
    meta_key: string
    meta_value: string
}
type PostMetaRecord = Record<string, string>

export const getPostMeta = async <T = string>(
    postId: number,
    metaKey: string,
    defaultValue: T,
): Promise<T> => {
    const value: T = await MySQL.getInstance()
        .query<any[]>(MySQLQuery.getPostMeta(postId, metaKey), [
            { meta_value: defaultValue },
        ])
        .then((result) => result[0].meta_value)

    // Serialize
    if (isSerialized(value as unknown as string)) {
        return PHPUnserialize.unserialize(value)
    }

    return value
}

export const getAllPostMeta = async (
    postId: number,
): Promise<PostMetaRecord> => {
    const query = MySQLQuery.getAllPostMeta(postId)
    const result = await MySQL.getInstance().query<PostMeta[]>(query, [])

    return result.reduce((acc: PostMetaRecord, member) => {
        return {
            ...acc,
            [member.meta_key]: member.meta_value,
        }
    }, {})
}
