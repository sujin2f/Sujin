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
import { isAdmin } from '@lib/utils/session'
import { getSessionContext } from '@lib/apollo/admin'
/* T_Type */
import type { PropWithPages, T_ArchivePost } from '@sujin/lib/types'

type Props = {
    id: string
    page: number
    fields?: FIELDS
    query?: string
    bypassCache?: boolean
}

export const getArchivePosts = async ({
    id,
    page,
    fields,
    query,
    bypassCache,
}: Props): Promise<PropWithPages<T_ArchivePost, 'archivePosts'>> => {
    if (bypassCache && !isAdmin()) {
        throw new Error('You are trying illegal access!')
    }

    if (bypassCache && query) {
        return await queryPosts(id, page, query, true)
    }

    if (!fields) {
        throw new Error('You are trying illegal access!')
    }

    const request = unstable_cache(
        cachedPosts,
        [id, page.toString(), fields, VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate: REVALIDATION,
        },
    )
    return await request(id, page, fields, false)
}

const cachedPosts = async (
    id: string,
    page: number,
    fields: FIELDS,
    bypassCache: boolean,
): Promise<PropWithPages<T_ArchivePost, 'archivePosts'>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, id, page, fields),
    )
    return await request(id, page, FIELDS[fields], bypassCache)
}

const queryPosts = async (
    id: string,
    page: number,
    fields: string,
    bypassCache: boolean,
): Promise<PropWithPages<T_ArchivePost, 'archivePosts'>> => {
    return await client
        .query<PropWithPages<T_ArchivePost, 'archivePosts'>>({
            query: gql`
                query ArchivePosts($id: String!, $page: Int!, $bypassCache: Boolean!) {
                    archivePosts(id: $id, page: $page, bypassCache: $bypassCache) {
                        ${fields}
                    }
                    numPages(context: "archive-posts", id: $id)
                }
            `,
            variables: {
                id,
                page,
                bypassCache,
            },
            context: await getSessionContext(),
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
        .catch(() => {
            return {
                archivePosts: [],
                numPages: 1,
            }
        })
}
