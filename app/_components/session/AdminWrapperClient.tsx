import { useSession } from 'next-auth/react'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin } from '@app/_lib/utils-server'

/**
 * Wrapper for admin access
 *
 * @example
 * 'use server'
 * <SessionProvider>
 *     <SessionProviderClient>
 *         <AdminWrapperClient>
 *             ...
 *         </AdminWrapperClient>
 *     </SessionProviderClient>
 * </SessionProvider>
 */
export function AdminWrapperClient({ children }: PropsWithChildren) {
    const { data: session } = useSession()
    const router = useRouter()

    if (session && !isAdmin(session.user?.email)) {
        router.replace('/')
    }

    return children
}
