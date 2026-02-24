import { Types } from 'mongoose'
/* Models */
import { FocusBrowser } from '@src/schema/focus'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'

export const createFocusBrowser = async (user: Types.ObjectId, message: T_Focus_Message) => {
    if (message.machineId === 'N/A') {
        return
    }

    const exist = await FocusBrowser.findOne({ user, device: message.device, machineId: message.machineId })
    if (!exist) {
        await FocusBrowser.insertOne({ user, device: `${message.device} - ${message.machineId}` })
    }
}
