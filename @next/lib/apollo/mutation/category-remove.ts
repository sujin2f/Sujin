'use server'
import { client } from '@lib/apollo/apollo-client-server'
import { getSessionContext } from '@lib/utils/session'
import REMOVE_ARCHIVE_MUTATION from '@lib/apollo/gql/archive.remove.graphql'
import { ARCHIVE } from '@sujin/lib/constants'

export const removeCategory = async (slug: string) => {
    return await client
        .mutate({
            mutation: REMOVE_ARCHIVE_MUTATION,
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
