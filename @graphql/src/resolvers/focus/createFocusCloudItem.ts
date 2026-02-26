import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* CONSTANTS */
import { HOUR_IN_MS } from '@sujin/share/constants/datetime'
import { COLLECTION } from '@sujin/lib/constants'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { removeCache } from '@src/utils/redis/cache'
import { registerFocusBrowser } from '@src/utils/mongo/focus'

export const createFocusCloudItem = async (message: T_Focus_Message, token: string): Promise<string> => {
    Logger.info('createFocusCloudItem() attempted')

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
        await removeCache(`${COLLECTION.FOCUS_MESSAGE}-${user.email}`)
        Logger.info('createFocusCloudItem() created')
        return 'ok'
    }

    return exists._id.toString() || 'duplicated'
}
