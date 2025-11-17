'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/apollo/admin'
import ARCHIVE_MUTATION from '@lib/apollo/gql/archive.update.graphql'
import { ARCHIVE } from '@sujin/lib/constants'

export const updateCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: ARCHIVE_MUTATION,
            variables: {
                slug,
                archiveType: ARCHIVE.CATEGORY,
            },
            context: await getSessionContext(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            return true
        })
}
