/* Models */
import { FocusBrowser } from '@src/schema/focus'
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
/* Utils */
import { verifyAccessToken, verifyAdmin } from '@src/utils/security'
/* CONSTANTS */

const then = async () => {
    Logger.log('removeDevices() executed successfully.')
    return true
}

const reject = async (e: Error) => {
    Logger.error('removeDevices() failed: ', e.message)
    return false
}

export const removeDevices = async (token: string): Promise<boolean> => {
    Logger.log('removeDevices() requested')
    const user = await verifyAccessToken(token)
    await verifyAdmin(user.email)
    return await FocusBrowser.deleteMany().then(then).catch(reject)
}
