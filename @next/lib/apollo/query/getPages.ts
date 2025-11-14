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
): Promise<PropWithPages<T_ArchivePost>> => {
    return await client
        .query<{ pages: T_ArchivePost[]; numPages: number }>({
            query: gql`
                query QueryPages($page: Int!) {
                    pages(page: $page) {
                        ${fields}
                    }
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

            return { ...result.data, list: result.data.pages }
        })
        .catch((e) => {
            throw e.errors[0]
        })
}
