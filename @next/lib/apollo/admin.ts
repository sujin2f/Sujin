'use server'
import { getToken } from '@lib/utils/session'

export const getSessionContext = async () => {
    const token = await getToken()
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}
