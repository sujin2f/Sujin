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
import { createFocusBrowser } from '@src/utils/mongo/focus'

export const createBookmark = async (message: T_Focus_Message, token: string): Promise<string> => {
    Logger.info('🤞 createFocusMessage start')
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()
    const userId = new Types.ObjectId(user._id)

    await createFocusBrowser(userId, message)

    const exists = await Focus.findOne({ type: message.type, key: message.key, user: userId })
    if (!exists) {
        const expires = Math.round(new Date().getTime() / HOUR_IN_MS) + 24 // Expires in 24 hours
        await Focus.insertOne({ ...message, user: userId, expires })
        await removeCache(`${COLLECTION.BOOKMARK}-${user.email}`)
        Logger.info('🤞 createFocusMessage created')
        return 'ok'
    }
    return 'duplicated'
}
