import type { Document } from 'mongoose'
/* Models */
import { FocusBrowser } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_Focus_Device } from '@sujin/lib/types'
import type { Response } from '@src/types'
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* CONSTANTS */
import { PER_PAGE } from '@sujin/lib/constants'

const then = async (devices: Document[]) => {
    Logger.log('getDevices() executed successfully: ', devices.length)
    return devices.map((device) => ({ ...device.toObject(), _id: device._id.toString() }))
}

const reject = async (e: Error) => {
    Logger.error('getDevices() failed', e.message)
    return []
}

export const getDevices = async (page: number, token: string, res: Response): Promise<T_Focus_Device[]> => {
    Logger.log('getDevices() requested', page)
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)

    const result = await FocusBrowser.find()
        .skip(PER_PAGE * (page - 1))
        .limit(PER_PAGE)
        .then(then)
        .catch(reject)

    const total = await FocusBrowser.countDocuments()
    res.setHeader('total-pages', Math.ceil(total / PER_PAGE))
    return result
}
