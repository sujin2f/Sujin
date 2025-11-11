import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Utils */
import { isAdmin } from '@app/api/auth/_lib/utils-server'
import { IS_DEV } from '@sujin/common/constants/helper'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    if (!IS_DEV && !(await isAdmin())) notFound()
    return children
}
