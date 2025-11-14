import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Utils */
import { isAdmin } from '@lib/utils/session'
import { IS_DEV } from '@sujin/share/constants/helper'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    if (!IS_DEV && !(await isAdmin())) notFound()
    return children
}
