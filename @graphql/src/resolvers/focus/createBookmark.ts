import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@common/model/Logger'
/* T_Types */
import type { T_Focus_Message } from '@common/types'
/* CONSTANTS */
import { HOUR_IN_MS } from '@common/constants/datetime'
import { COLLECTION } from '@common/constants'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { removeCache } from '@src/utils/redis/cache'
import { registerFocusBrowser } from '@src/utils/mongo/focus'

/**
 * @deprecated Backward compatibility
 */
export const createBookmark = async (message: T_Focus_Message, token: string): Promise<string> => {
    Logger.info('createBookmark() attempted')

    const user = await verifyAccessToken(token)
    const userId = new Types.ObjectId(user._id)

    await registerFocusBrowser(userId, message)

    const now = Math.round(new Date().getTime() / HOUR_IN_MS)
    const exists = await Focus.findOne({ type: message.type, key: message.key, user: userId }).then(async (item) => {
        // Remove expired
        if (item) {
            if (item.expires < now) {
                await Focus.deleteOne({ _id: item._id })
                return false
            }
            return item
        }
    })

    if (!exists) {
        const expires = now + 24 // Expires in 24 hours
        await Focus.insertOne({ ...message, user: userId, expires })
        await removeCache(`${COLLECTION.BOOKMARK}-${user.email}`)
        Logger.info('createBookmark() created')
        return 'ok'
    }

    return 'duplicated'
}
