'use server'
import { type PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth'
import SessionProviderClient from '@app/_components/SessionProviderClient'
import { authOptions } from '@app/api/auth/constants'

const SessionProvider = async ({ children }: PropsWithChildren) => {
    const session = await getServerSession(authOptions)

    return (
        <SessionProviderClient session={session}>
            {children}
        </SessionProviderClient>
    )
}

export default SessionProvider
