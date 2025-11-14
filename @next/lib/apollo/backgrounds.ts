'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION, T_Background } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { FIELDS } from '@lib/constants/graphql-fields'

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
export const getBackgrounds = async (
    fields: FIELDS,
): Promise<T_Background[]> => {
    const request = unstable_cache(cachedBackgrounds, [fields, VERSION], {
        tags: ['wordpress', 'backgrounds'],
        revalidate: REVALIDATION,
    })
    return await request(fields)
}

const cachedBackgrounds = async (fields: FIELDS): Promise<T_Background[]> => {
    const request = cachedRequest(
        queryBackgrounds,
        getCacheKey(COLLECTION.BACKGROUNDS, fields),
    )
    return await request(fields)
}

const queryBackgrounds = async (fields: FIELDS): Promise<T_Background[]> => {
    return await client
        .query<{ backgrounds: T_Background[] }>({
            query: gql`
                query Backgrounds {
                    backgrounds { ${FIELDS[fields]} }
                }
            `,
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find backgrounds`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.data.backgrounds
        })
        .catch((e) => {
            console.error(e)
            throw e.errors[0]
        })
}
