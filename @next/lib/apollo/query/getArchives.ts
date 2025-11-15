'use server'
import { GraphQLError } from 'graphql'
import { gql } from '@apollo/client'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/constants'
/* T_Types */
import type { PropWithPages, T_Archive } from '@sujin/lib/types'
/* Utils */
import { getSessionContext } from '@lib/apollo/admin'

export const getArchives = async (
    page: number,
    type: ARCHIVE,
    fields: string,
): Promise<PropWithPages<T_Archive, 'archive'>> => {
    return await client
        .query<PropWithPages<T_Archive, 'archive'>>({
            query: gql`
                query Archives($page: Int!, $type: ARCHIVE_TYPE!) {
                    archive(archiveType: $type, page: $page) { ${fields} }
                    numPages(context: "archives", type: $type)
                }
            `,
            variables: {
                page,
                type,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result || !result.data) {
                throw new GraphQLError(`Cannot find archive`, {
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
