import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
/* CONSTANTS */
import { authOptions } from '@app/api/auth/constants'
import { isAdmin } from '@app/_lib/utils-server'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    const session = await getServerSession(authOptions)

    if (!session) {
        notFound()
    }
    if (!isAdmin(session.user?.email)) {
        notFound()
    }

    return children
}
