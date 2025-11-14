'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION, type T_Archive } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
import { FIELDS } from '@lib/constants/graphql-fields'

/**
 * Get archive by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Archive>} - The archive object
 */
export const getArchive = async (
    slug: string,
    type: string,
    fields: FIELDS,
): Promise<T_Archive> => {
    const request = unstable_cache(
        cachedArchive,
        [slug, type, fields, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: REVALIDATION,
        },
    )
    return await request(slug, type, fields)
}

const cachedArchive = async (slug: string, type: string, fields: FIELDS) => {
    const request = cachedRequest(
        queryArchive,
        getCacheKey(COLLECTION.POST, slug, type, fields),
    )
    return await request(slug, type, fields)
}

const queryArchive = async (
    slug: string,
    type: string,
    fields: FIELDS,
): Promise<T_Archive> => {
    return await client
        .query<{ archive: T_Archive }>({
            query: gql`
                query Archive($slug: String!, $type: String!) {
                    archive(slug: $slug, type: $type) { ${FIELDS[fields]} }
                }
            `,
            variables: {
                slug,
                type,
            },
        })
        .then((result) => {
            if (!result.data) {
                throw new GraphQLError(`Cannot find archive ${slug} ${type}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.data.archive
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
