'use server'
import { getServerSession } from 'next-auth'
/* CONSTANTS */
import { authOptions } from '@lib/constants/auth'
/* T_Types */
import type { T_SessionUser } from '@sujin/lib/types'

export const getSession = async () => await getServerSession(authOptions)

/**
 *
 * @returns {Promise<T_Stringify<T_SessionUser>>}
 * @throws {UnauthorizedError}
 */
export const getCurrentUser = async (): Promise<T_SessionUser | undefined> => {
    const session = await getSession().catch(() => undefined)
    if (!session || !session.user) return
    return session.user
}

export const isAdmin = async (): Promise<boolean> =>
    await getCurrentUser().then(
        (user) => !!user && user?.email === process.env.ADMIN_EMAIL,
    )
