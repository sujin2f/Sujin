'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* T_Types */
import type { PropWithPages, T_ArchivePost } from '@sujin/lib/types'
/* Utils */
import { getSessionContext } from '@lib/apollo/admin'

export const getPages = async (
    page: number,
    fields: string,
): Promise<PropWithPages<T_ArchivePost, 'post'>> => {
    return await client
        .query<{ post: T_ArchivePost[]; numPages: number }>({
            query: gql`
                query ListPages($page: Int!) {
                    post(postType: page, page: $page) { ${fields} }
                    numPages(context: "pages")
                }
            `,
            variables: {
                page,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find pages`, {
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
