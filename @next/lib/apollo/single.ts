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
import {
    COLLECTION,
    PropWithPages,
    T_ArchivePost,
    type T_Page,
} from '@sujin/lib/types'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

/**
 * Get single page by slug
 * This returns the cached result if it exists
 *
 * @param {string} slug - Post slug
 * @returns {Promise<T_Page>} - The post object
 */
export const getSingle = async <T extends T_Page>(
    slug: string,
    type: string,
    fields: string,
): Promise<T> => {
    const request = unstable_cache(
        cachedSingle<T>,
        [slug, type, getUuid(fields), VERSION],
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
    fields: string,
) => {
    const request = cachedRequest(
        querySingle<T>,
        getCacheKey(COLLECTION.POST, slug, type, getUuid(fields)),
    )
    return await request(slug, type, fields)
}

const querySingle = async <T extends T_Page>(
    slug: string,
    type: string,
    fields: string,
): Promise<T> => {
    return await client
        .query<{ post: T }>({
            query: gql`
                query Post($slug: String!, $type: String!) {
                    post(slug: $slug, type: $type) { ${fields} }
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
            return result.data.post
        })
        .catch((e) => {
            throw e.errors[0]
        })
}

export const getPosts = async (
    id: string,
    page: number,
    fields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cachedPosts,
        [id, page.toString(), getUuid(fields), VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: REVALIDATION,
        },
    )
    return await request(id, page, fields)
}

const cachedPosts = async (
    id: string,
    page: number,
    fields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page, getUuid(fields)),
    )
    return await request(id, page, fields)
}

const queryPosts = async (
    id: string,
    page: number,
    fields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    return await client
        .query<PropWithPages<T_ArchivePost>>({
            query: gql`
                query ArchivePosts($id: String!, $page: Int!) {
                    list(id: $id, page: $page) {
                        ${fields}
                    }
                    pages(id: $id)
                }
            `,
            variables: {
                id,
                page,
            },
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find archive posts from ${id}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }

            return result.data
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
