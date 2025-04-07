'use server'
import { type PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth'
import { SessionProviderClient } from '@app/_components/session/SessionProviderClient'
import { authOptions } from '@app/api/auth/constants'

/**
 * Wrap with this component to use your client component could use the session
 * In the children, call useSession()
 *
 * @example
 * 'use client'
 * const { data: session } = useSession()
 * const name = session && session.user && session.user.name
 */
export const SessionProvider = async ({ children }: PropsWithChildren) => {
    const session = await getServerSession(authOptions)

    return (
        <SessionProviderClient session={session}>
            {children}
        </SessionProviderClient>
    )
}
