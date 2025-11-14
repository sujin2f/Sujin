'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
import getUuid from 'uuid-by-string'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION, T_ArchivePost, type T_Archive } from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

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
    fields: string,
): Promise<T_Archive> => {
    const request = unstable_cache(
        cachedArchive,
        [slug, type, getUuid(fields), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: REVALIDATION,
        },
    )
    return await request(slug, type, fields)
}

const cachedArchive = async (slug: string, type: string, fields: string) => {
    const request = cachedRequest(
        queryArchive,
        getCacheKey(COLLECTION.POST, slug, type, getUuid(fields)),
    )
    return await request(slug, type, fields)
}

const queryArchive = async (
    slug: string,
    type: string,
    fields: string,
): Promise<T_Archive> => {
    return await client
        .query<{ archive: T_Archive }>({
            query: gql`
                query Archive($slug: String!, $type: String!) {
                    archive(slug: $slug, type: $type) { ${fields} }
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

export const updateHits = async (slug: string) => {
    return await client
        .mutate<{ archive: T_Archive }>({
            mutation: gql`
                query UpdateHits($slug: String!) {
                    updateHits(slug: $slug) {
                        result
                    }
                }
            `,
            variables: {
                slug,
            },
        })
        // TODO Log
        .catch(() => {})
}

/**
 * Get recent posts
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Archive>} - The archive object
 */
export const getRecent = async (fields: string): Promise<T_ArchivePost[]> => {
    const request = unstable_cache(cachedRecent, [getUuid(fields), VERSION], {
        tags: ['wordpress', 'recent'],
        revalidate: REVALIDATION,
    })
    return await request(fields)
}

const cachedRecent = async (fields: string) => {
    const request = cachedRequest(
        queryRecent,
        getCacheKey(COLLECTION.ARCHIVE, 'recent', getUuid(fields)),
    )
    return await request(fields)
}

const queryRecent = async (fields: string): Promise<T_ArchivePost[]> => {
    return await client
        .query<{ recent: T_ArchivePost[] }>({
            query: gql`
                query Recent {
                    recent { ${fields} }
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
