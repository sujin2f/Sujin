import jwt from 'jsonwebtoken'
import { getServerSession, type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
/* Utils */
import { login } from '@lib/apollo/queries/users/login'
/* T_Types */
import type { T_Session } from '@sujin/lib/types'
/* CONSTANTS */
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || ''

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    session: {
        maxAge: 7 * DAY_IN_SECONDS,
    },
    secret: NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token: nextToken }) {
            // Google logged in, but not to GQL
            if (nextToken && nextToken.email && !nextToken.accessToken) {
                const refreshToken = jwt.sign(
                    {
                        name: nextToken.name,
                        email: nextToken.email,
                        picture: nextToken.picture,
                    },
                    NEXTAUTH_SECRET,
                    {
                        expiresIn: '7d',
                    },
                )
                const { _id, accessToken } = await login(refreshToken)
                return { ...nextToken, _id, accessToken, refreshToken }
            }
            return { ...nextToken }
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token._id,
                } as T_Session,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
            }
        },
    },
} satisfies AuthOptions

export const getSession = async () => await getServerSession(authOptions)

// TODO use refresh token to refresh
export const getTokens = async (): Promise<string[]> => {
    const session = await getSession().catch(() => undefined)
    if (!session || !session.accessToken || !session.refreshToken) return []
    return [session.accessToken as string, session.refreshToken as string]
}

export const getSessionContext = async () => {
    const token = await getTokens().catch(() => [])
    if (!token.length) {
        return {}
    }

    return {
        headers: {
            Authorization: `Bearer ${token[0]}`,
        },
    }
}
