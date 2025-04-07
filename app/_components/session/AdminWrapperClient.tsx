import { useSession } from 'next-auth/react'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/navigation'

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

    if (session && session.user?.email !== process.env.ADMIN_EMAIL) {
        router.replace('/')
    }

    return children
}
