import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Utils */
import { isAdmin } from '@app/_lib/utils-server'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    if (!isAdmin()) notFound()
    return children
}
