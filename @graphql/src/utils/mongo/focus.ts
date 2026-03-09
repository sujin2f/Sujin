import { Types } from 'mongoose'
/* Models */
import { FocusBrowser } from '@src/schema/focus'
/* T_Types */
import type { T_Focus_Message } from '@sujin/lib/types'

export const registerFocusBrowser = async (user: Types.ObjectId, message: T_Focus_Message) => {
    const { device, machineId } = message
    // 🤬 Old version
    if (machineId === 'N/A') return

    await FocusBrowser.findOne({ user, device, machineId }).then(async (doc) => {
        if (doc) return
        await FocusBrowser.insertOne({ user, device, machineId })
    })
}
