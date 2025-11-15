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
import type { PropWithPages, T_ArchivePost } from '@sujin/lib/types'

type Props = {
    category: string
    page: number
    fields?: FIELDS
    query?: string
}

export const getPostsByCategory = async ({
    category,
    page,
    fields,
    query,
}: Props): Promise<PropWithPages<T_ArchivePost, 'post'>> => {
    if (query) {
        return await queryPosts(category, page, query)
    }

    if (!fields) {
        throw new Error('You are trying illegal access!')
    }

    const request = unstable_cache(
        cachedPosts,
        [category, page.toString(), fields, VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: REVALIDATION,
        },
    )
    return await request(category, page, fields)
}

const cachedPosts = async (
    category: string,
    page: number,
    fields: FIELDS,
): Promise<PropWithPages<T_ArchivePost, 'post'>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, category, page, fields),
    )
    return await request(category, page, FIELDS[fields])
}

const queryPosts = async (
    category: string,
    page: number,
    fields: string,
): Promise<PropWithPages<T_ArchivePost, 'post'>> => {
    return await client
        .query<PropWithPages<T_ArchivePost, 'post'>>({
            query: gql`
                query GetPostsByCategory($category: String!, $page: Int!) {
                    post(postType: post, category: $category, page: $page) {
                        ${fields}
                    }
                    numPages(context: "archive-posts", category: $category)
                }
            `,
            variables: {
                category,
                page,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(
                    `Cannot find archive posts from ${category}`,
                    {
                        extensions: {
                            code: 'NO_CONTENT',
                        },
                    },
                )
            }

            return result.data
        })
        .catch(() => {
            return {
                post: [],
                numPages: 1,
            }
        })
}
