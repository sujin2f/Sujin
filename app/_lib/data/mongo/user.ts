import { getServerSession } from 'next-auth'

import { type T_SessionUser } from '@app/_lib/types'
import { authOptions } from '@app/api/auth/_lib/constants'
import { getOption, removeOption } from '@app/_lib/data/mysql/option'
import { ERROR_MESSAGE } from '@app/_lib/constants-error'
import { ForbiddenError, UnauthorizedError } from '@common/model/Error'

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

/**
 * User admin and WP nonce allow to access
 *
 * @param {string} nonce
 * @param {string} slug
 * @returns {Promise<void>}
 * @throws {ForbiddenError} Failed to access
 */
export const auth = async (nonce?: string, slug?: string): Promise<void> => {
    const admin = await isAdmin()
    if (admin) return

    // Nonce validation
    if (!nonce) {
        throw new ForbiddenError(ERROR_MESSAGE.NONCE_FAILED)
    }
    const optionKey = ['mutate', slug, nonce].join('_')
    await getOption(optionKey).catch(() => {
        throw new ForbiddenError(`Failed to get MySQL option: ${optionKey}`)
    })
    await removeOption(optionKey)
}
