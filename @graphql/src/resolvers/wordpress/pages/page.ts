import { GraphQLError } from 'graphql'
import sanitize from 'mongo-sanitize'
/* Models */
import Logger from '@src/utils/logger'
import { Page } from '@src/schema/post'
/* CONSTANTS */
import { COLLECTION, POST_STATUS } from '@sujin/lib/constants'
/* Utils */
import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
/* T_Types */
import type { T_Page } from '@sujin/lib/types'

export const page = async (_slug: string): Promise<T_Page> => {
    const slug = sanitize(_slug)

    const request = cachedRequest(async (): Promise<T_Page> => {
        return await Page.findOne<T_Page>({
            slug,
            status: POST_STATUS.PUBLISH,
        }).then((result) => {
            if (!result) {
                throw new GraphQLError(`Cannot find the page ${slug}`, {
                    extensions: {
                        code: 'NO_CONTENT',
                    },
                })
            }

            return result
        })
    }, getCacheKey(COLLECTION.PAGE, slug))
    const result = await request()
    Logger.info(`🤟 page query done: ${slug}`)
    return result
}
