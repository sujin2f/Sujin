import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* CONSTANTS */
import { HOUR_IN_MS, MINUTE_IN_SECONDS } from '@sujin/share/constants/datetime'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { setCache } from '@src/utils/redis/cache'
import { COLLECTION } from '@sujin/lib/constants'

export const getBookmarks = async (token: string): Promise<T_Focus_Message[]> => {
    Logger.info('🤞 getBookmarks request start')
    const user = await verifyAccessToken(token)
    const now = Math.round(new Date().getTime() / HOUR_IN_MS)
    if (!user._id) throw new Error()

    const result = (await Focus.find({ user: new Types.ObjectId(user._id), type: 'bookmark' }))
        .filter(async (data) => {
            // Remove expired
            if (data.expires < now) {
                await Focus.deleteOne({ _id: data._id })
                return false
            }
            return true
        })
        .map(
            (data) =>
                ({
                    _id: data._id.toString(),
                    key: data.key,
                    title: data.title,
                    device: data.device,
                    type: data.type,
                    message: data.message,
                }) satisfies T_Focus_Message,
        )

    setCache(JSON.stringify(result), `${COLLECTION.BOOKMARK}-${user.email}`, 30 * MINUTE_IN_SECONDS)
    Logger.info('🤞 getFocusMessages done')

    return result
}
