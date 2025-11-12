'use server'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { NoContentError } from '@sujin/share/model/Error'
import { client } from '@lib/apollo/server-client'
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
export const getSingle = async (
    slug: string,
    type: string,
    fields: string,
): Promise<T_Page> => {
    const request = unstable_cache(
        cachedSingle,
        [slug, type, fields, VERSION],
        {
            tags: ['wordpress', 'single'],
            revalidate: REVALIDATION,
        },
    )
    return await request(slug, type, fields)
}

const cachedSingle = async (slug: string, type: string, fields: string) => {
    const request = cachedRequest(
        querySingle,
        getCacheKey(COLLECTION.POST, slug, type, fields),
    )
    return await request(slug, type, fields)
}

const querySingle = async (
    slug: string,
    type: string,
    fields: string,
): Promise<T_Page> => {
    return await client
        .query<{ post: T_Page }>({
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
                throw new NoContentError(
                    `Could not find the ${type} -- ${slug}`,
                ).log()
            }
            return result.data.post
        })
}

export const getPosts = async (
    id: string,
    page: number,
    postFields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cachedPosts,
        [id, page.toString(), postFields, VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: REVALIDATION,
        },
    )
    return await request(id, page, postFields)
}

const cachedPosts = async (
    id: string,
    page: number,
    postFields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page, postFields),
    )
    return await request(id, page, postFields)
}

const queryPosts = async (
    id: string,
    page: number,
    postFields: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    return await client
        .query<PropWithPages<T_ArchivePost>>({
            query: gql`
                query ArchivePosts($id: String!, $page: Int!) {
                    list(id: $id, page: $page) {
                        ${postFields}
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
                throw new NoContentError(
                    `Could not find archive posts from ${id}`,
                ).log()
            }

            return result.data
        })
}
