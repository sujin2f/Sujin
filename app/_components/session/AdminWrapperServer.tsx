import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
/* CONSTANTS */
import { authOptions } from '@app/api/auth/constants'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    const session = await getServerSession(authOptions)

    if (!session) {
        notFound()
    }
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        notFound()
    }

    return children
}
