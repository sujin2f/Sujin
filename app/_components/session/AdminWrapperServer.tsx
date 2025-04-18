import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    if (!(await isAdmin())) notFound()
    return children
}
