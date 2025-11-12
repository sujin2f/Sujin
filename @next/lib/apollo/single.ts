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
    T_Archive,
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
): Promise<T_Page> => {
    const request = unstable_cache(cachedSingle, [slug, type, VERSION], {
        tags: ['wordpress', 'single'],
        revalidate: REVALIDATION,
    })
    return await request(slug, type)
}

const cachedSingle = async (slug: string, type: string) => {
    const request = cachedRequest(
        querySingle,
        getCacheKey(COLLECTION.POST, slug, type),
    )
    return await request(slug, type)
}

const querySingle = async (slug: string, type: string): Promise<T_Page> => {
    return await client
        .query<{ post: T_Page }>({
            query: gql`
                query Post($slug: String!, $type: String!) {
                    post(slug: $slug, type: $type) {
                        id
                        title
                        slug
                        content
                        link
                        meta {
                            backgroundColor
                        }
                    }
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
    archive: T_Archive,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cachedPosts,
        [archive.type, archive.slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: REVALIDATION,
        },
    )
    return await request(archive, page)
}

const cachedPosts = async (
    archive: T_Archive,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, archive.type, archive.slug, page),
    )
    return await request(archive, page)
}

const queryPosts = async (
    archive: T_Archive,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    return await client
        .query<PropWithPages<T_ArchivePost>>({
            query: gql`
                query ArchivePosts(
                    $slug: String!
                    $type: String!
                    $page: Number!
                ) {
                    list(slug: $slug, type: $type, page: $page) {
                        id
                        title
                        slug
                        content
                        link
                        meta {
                            backgroundColor
                        }
                    }
                    pages(slug: $slug, type: $type) {
                        result
                    }
                }
            `,
            variables: {
                slug: archive.slug,
                type: archive.type,
                page,
            },
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new NoContentError(
                    `Could not find archive posts from ${archive.type} -- ${archive.slug}`,
                ).log()
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pages = (result.data.pages as any).result as number
            return {
                ...result.data,
                pages,
            }
        })
}
