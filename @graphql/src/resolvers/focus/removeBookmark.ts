import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { getBookmarks } from './getBookmarks'
import { removeCache } from '@src/utils/redis/cache'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

/**
 * @deprecated Backward compatibility
 */
export const removeBookmark = async (id: string, token: string): Promise<T_Focus_Message[]> => {
    Logger.info('🤞 removeFocusMessage start')
    const user = await verifyAccessToken(token)
    if (!user._id) throw new Error()

    await Focus.deleteOne({ _id: new Types.ObjectId(id) })
    Logger.info('🤞 removeFocusMessage done')
    await removeCache(`${COLLECTION.BOOKMARK}-${user.email}`)

    return await getBookmarks(token)
}
