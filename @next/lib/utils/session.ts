import jwt from 'jsonwebtoken'
import { getServerSession, type AuthOptions } from 'next-auth'
import { cookies } from 'next/headers'
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
                ;(await cookies()).set('sujin-refresh-token', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * DAY_IN_SECONDS,
                    path: '/',
                    sameSite: 'lax',
                })

                return { ...nextToken, _id, accessToken }
            }
            return { ...nextToken }
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token._id,
                    accessToken: token.accessToken,
                } as T_Session,
            }
        },
    },
} satisfies AuthOptions

export const getSession = async () => await getServerSession(authOptions)

// TODO use refresh token to refresh
export const getAccessToken = async (): Promise<string> => {
    const session = await getSession().catch(() => undefined)
    if (!session || !session.user || !session.user.accessToken) return ''
    return session.user.accessToken as string
}

export const getSessionContext = async () => {
    const token = await getAccessToken().catch(() => false)
    if (!token) {
        return {}
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}
