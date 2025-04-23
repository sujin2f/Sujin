import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
import { IS_DEV } from '@common/constants/helper'

/**
 * Wrapper for admin access
 */
export async function AdminWrapperServer({ children }: PropsWithChildren) {
    if (!IS_DEV && !(await isAdmin())) notFound()
    return children
}
