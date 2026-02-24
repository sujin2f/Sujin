import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* CONSTANTS */
import { HOUR_IN_MS } from '@sujin/share/constants/datetime'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'

export const createBookmark = async (message: T_Focus_Message, token: string): Promise<string> => {
    Logger.info('🤞 createFocusMessage start')
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()

    const exists = await Focus.findOne({ type: 'bookmark', key: message.key })
    if (!exists) {
        const expires = Math.round(new Date().getTime() / HOUR_IN_MS) + 24 // Expires in 24 hours
        await Focus.insertOne({ ...message, user: new Types.ObjectId(user._id), expires })
        Logger.info('🤞 createFocusMessage created')
        return 'ok'
    }
    return 'duplicated'
}
