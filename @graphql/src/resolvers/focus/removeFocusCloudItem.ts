import { Types } from 'mongoose'
/* Models */
import { Focus } from '@src/schema/focus'
import { Logger } from '@common/model/Logger'
/* Utils */
import { verifyAccessToken } from '@src/utils/security'
import { removeCache } from '@src/utils/redis/cache'
/* CONSTANTS */
import { COLLECTION } from '@common/constants'

export const removeFocusCloudItem = async (id: string, token: string): Promise<string> => {
    const user = await verifyAccessToken(token)
    const item = await Focus.findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(user._id) })
    if (!item) {
        await removeCache(`${COLLECTION.FOCUS_MESSAGE}-${user.email}`)
        Logger.error('Failed removeFocusCloudItem: not-exist')
        return 'not-exist'
    }

    await Focus.deleteOne({ _id: new Types.ObjectId(id) })
    Logger.info('removeFocusCloudItem() attempted', id)
    await removeCache(`${COLLECTION.FOCUS_MESSAGE}-${user.email}`)
    return 'ok'
}
