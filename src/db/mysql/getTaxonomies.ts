'use server'

import { MySQLQuery } from '@src/constants/mysql-query'
import { TermTypes } from '@src/types/wordpress'
import type { Term } from '@src/types/wordpress'
import { MySQL } from '@src/db/mysql'

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
