'use server'

import { MySQLQuery } from '@src/constants/mysql-query'
import { Nullable } from '@common/types'
import { TermTypes } from '@src/types/wordpress'
import { Term } from '@src/types/wordpress'
import { MySQL } from '@src/db/mysql'

export const getTermMeta = async <T = string>(
    id: number,
    metaKey: string,
): Promise<Nullable<T>> => {
    return await MySQL.getInstance().selectOne<T>(
        MySQLQuery.getTermMeta(id, metaKey),
    )
}

export const getTaxonomies = async (postId: number): Promise<Term[]> => {
    const result = await MySQL.getInstance().select<Term>(
        MySQLQuery.getTaxonomies(postId),
    )

    return result.map((item) => ({
        ...item,
        type: TermTypes[item.type as keyof typeof TermTypes],
        page: 0,
    }))
}
