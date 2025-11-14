'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION, T_ArchivePost } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { FIELDS } from '@lib/constants/graphql-fields'

/**
 * Get recent posts
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Archive>} - The archive object
 */
export const getRecent = async (fields: FIELDS): Promise<T_ArchivePost[]> => {
    const request = unstable_cache(cachedRecent, [fields, VERSION], {
        tags: ['wordpress', 'recent'],
        revalidate: REVALIDATION,
    })
    return await request(fields)
}

const cachedRecent = async (fields: FIELDS) => {
    const request = cachedRequest(
        queryRecent,
        getCacheKey(COLLECTION.ARCHIVE, 'recent', fields),
    )
    return await request(fields)
}

const queryRecent = async (fields: FIELDS): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ recent: T_ArchivePost[] }>({
            query: gql`
                query Recent {
                    recent { ${FIELDS[fields]} }
                }
            `,
        })
        .then((result) => {
            if (!result.data) {
                throw new GraphQLError(`Cannot find recent`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.data.recent
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
