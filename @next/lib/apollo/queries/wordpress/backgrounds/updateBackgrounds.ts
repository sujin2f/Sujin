'use server'
/* Models */
import { client } from '@lib/apollo/apollo-client-server'
/* Utils */
import { getAuthHeader } from '@lib/utils/server/header'
/* CONSTANTS */
import REFRESH_MUTATION from '@lib/apollo/queries/wordpress/backgrounds/backgrounds.refresh.graphql'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

export const updateBackgrounds = async () => {
    Logger.info('🤞 updateBackgrounds query start!')
    return await client
        .mutate({
            mutation: REFRESH_MUTATION,
            context: await getAuthHeader(),
        })
        .then((result) => {
            if (!result.data) {
                return false
            }
            Logger.info('⭐️ updateBackgrounds query done!')
            return true
        })
        .catch((e) => {
            Logger.error(`🤬 updateBackgrounds query failed! ${JSON.stringify(e)}`)
            throw e
        })
}
