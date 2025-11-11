/* Models */
import { select } from '@common/data/mysql'
import { FetchError } from '@common/model/Error'
/* CONSTANTS */
import { MySQLQuery } from '@src/utils/mysql/constants'
/* T_Types */
import type { T_Background, T_MySQLPost } from '@lib/types'
/* Utils */
import { getMediaFromPost } from '@src/utils/mysql/getMediaFromPost'

/**
 * Get backgrounds from MySQL
 * @returns {Promise<T_ImageBlock[]>}
 * @throws
 */
export const getBackgrounds = async (): Promise<T_Background[]> => {
    const result = await select<T_MySQLPost>(MySQLQuery.getBackgrounds()).then(
        async (posts) => {
            const result: T_Background[] = []
            for await (const post of posts) {
                result.push(await getMediaFromPost(post))
            }
            return result
        },
    )

    if (!result.length) throw new FetchError('MySQL Background is empty')

    return result
}
