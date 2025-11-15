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
import { POST_TYPE } from '@sujin/lib/constants'
/* T_Type */
import type { T_Page } from '@sujin/lib/types'

/**
 * Get single post/page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
export const getSingle = async <T extends T_Page>(
    slug: string,
    type: POST_TYPE,
    fields: FIELDS,
): Promise<T> => {
    const request = unstable_cache(
        cachedSingle<T>,
        [slug, type, fields, VERSION],
        {
            tags: ['wordpress', 'single'],
            revalidate: REVALIDATION,
        },
    )
    return await request(slug, type, fields)
}

const cachedSingle = async <T extends T_Page>(
    slug: string,
    type: string,
    fields: FIELDS,
) => {
    const request = cachedRequest(
        querySingle<T>,
        getCacheKey(COLLECTION.POST, slug, type, fields),
    )
    return await request(slug, type, fields)
}

const querySingle = async <T extends T_Page>(
    slug: string,
    type: string,
    fields: FIELDS,
): Promise<T> => {
    return await client
        .query<{ post: T[] }>({
            query: gql`
                query Single($type: POST_TYPE!, $slug: String) {
                    post(postType: $type, slug: $slug) { ${FIELDS[fields]} }
                }
            `,
            variables: {
                slug,
                type,
            },
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find ${type} ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }
            return result.data.post[0]
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
