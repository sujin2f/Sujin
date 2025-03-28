'use server'
import { type PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth'
import SessionProviderClient from '@components/SessionProviderClient'
import { authOptions } from '@app/api/auth/[...nextauth]/route'

const SessionProvider = async ({ children }: PropsWithChildren) => {
    const session = await getServerSession(authOptions)

    return (
        <SessionProviderClient session={session}>
            {children}
        </SessionProviderClient>
    )
}

export default SessionProvider
