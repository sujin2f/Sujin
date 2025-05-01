'use server'
import { getServerSession } from 'next-auth'
/* Models */
import { UnauthorizedError } from '@common/model/Error'
/* CONSTANTS */
import { authOptions } from '@app/api/auth/_lib/constants'
/* T_Types */
import type { T_SessionUser } from '@app/_lib/types'

/**
 *
 * @returns {Promise<T_Stringify<T_SessionUser>>}
 * @throws {UnauthorizedError}
 */
export const getCurrentUser = async (): Promise<T_SessionUser> => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user)
        throw new UnauthorizedError('Could not find the current user.')
    return session.user
}

export const isAdmin = async (): Promise<boolean> => {
    return await getCurrentUser()
        .then((user) => user?.email === process.env.ADMIN_EMAIL)
        .catch(() => false)
}
