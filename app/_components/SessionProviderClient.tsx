'use client'
import { type PropsWithChildren } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

type Props = {
    session: Session | null
}

const SessionProviderClient = ({
    children,
    session,
}: PropsWithChildren<Props>) => {
    return <SessionProvider session={session}>{children}</SessionProvider>
}

export default SessionProviderClient
