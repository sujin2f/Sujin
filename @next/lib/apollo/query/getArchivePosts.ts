'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
import { unstable_cache } from 'next/cache'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { VERSION } from '@sujin/share/constants/helper'
import { REVALIDATION } from '@lib/constants'
import { COLLECTION, PropWithPages, T_ArchivePost } from '@sujin/lib/types'
import { FIELDS } from '@lib/constants/graphql-fields'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'

export const getArchivePosts = async (
    id: string,
    page: number,
    fields: FIELDS,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cachedPosts,
        [id, page.toString(), fields, VERSION],
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
    fields: FIELDS,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page, fields),
    )
    return await request(id, page, fields)
}

const queryPosts = async (
    id: string,
    page: number,
    fields: FIELDS,
): Promise<PropWithPages<T_ArchivePost>> => {
    return await client
        .query<{ archivePosts: T_ArchivePost[]; numPages: number }>({
            query: gql`
                query ArchivePosts($id: String!, $page: Int!) {
                    archivePosts(id: $id, page: $page) {
                        ${FIELDS[fields]}
                    }
                    numPages(context: "archive-posts", id: $id)
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

            return { ...result.data, list: result.data.archivePosts }
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
