'use server'
import { getToken } from '@lib/utils/session'

export const getSessionContext = async () => {
    const token = await getToken().catch(() => false)
    if (!token) {
        return {}
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}
