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

export const getBookmarks = async (token: string): Promise<T_Focus_Message[]> => {
    const user = await verifyAccessToken(token)
    const now = Math.round(new Date().getTime() / HOUR_IN_MS)
    if (!user._id) throw new Error()

    const message = (await Focus.find({ user: new Types.ObjectId(user._id), type: 'bookmark' }))
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
    Logger.info('🤞 getFocusMessages done')

    return message
}
