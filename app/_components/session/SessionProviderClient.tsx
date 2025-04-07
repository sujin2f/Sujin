'use client'
import { type PropsWithChildren } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

type Props = {
    session: Session | null
}

/**
 * Do not use this component directly.
 * Wrap with SessionProvider from server component
 */
export const SessionProviderClient = ({
    children,
    session,
}: PropsWithChildren<Props>) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}
