'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'
import { FIELDS } from '@lib/constants/graphql-fields'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { getSessionContext } from '@lib/apollo/admin'
/* T_Type */
import type { T_Background } from '@sujin/lib/types'

type Props = {
    fields?: FIELDS
    query?: string
}

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
export const getBackgrounds = async ({
    fields,
    query,
}: Props): Promise<T_Background[]> => {
    if (query) {
        return await queryBackgrounds(query)
    }

    if (!fields) {
        throw new Error('You are trying illegal access!')
    }

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
    return await request(FIELDS[fields])
}

const queryBackgrounds = async (fields: string): Promise<T_Background[]> => {
    return await client
        .query<{ background: T_Background[] }>({
            query: gql`
                query {
                    background { ${fields} }
                }`,
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find backgrounds`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.data.background
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
