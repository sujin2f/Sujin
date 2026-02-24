import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'

export const removeBookmark = async (id: string, token: string): Promise<string> => {
    Logger.info('🤞 removeFocusMessage start')
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()

    await Focus.deleteOne({ _id: new Types.ObjectId(id) })
    Logger.info('🤞 removeFocusMessage done')

    return 'ok'
}
