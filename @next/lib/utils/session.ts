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
            if (nextToken && nextToken.email && !nextToken.token) {
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
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken,
                    _id: token._id,
                } as T_Session,
            }
        },
    },
} satisfies AuthOptions

export const getSession = async () => await getServerSession(authOptions)

/**
 *
 * @returns {Promise<T_Stringify<T_Session>>}
 * @throws {UnauthorizedError}
 */
const getCurrentUser = async (): Promise<T_Session | undefined> => {
    const session = await getSession().catch(() => undefined)
    if (!session || !session.user) return
    return session.user
}

export const isAdmin = async (): Promise<boolean> =>
    await getToken().then((token) => {
        try {
            // TODO Remove
            const verify = jwt.verify(token, process.env.JWT_SECRET || '')
            return (verify as unknown as { admin: boolean }).admin
        } catch {
            return false
        }
    })

export const getToken = async () => {
    return await getCurrentUser().then((user) => {
        if (!user) {
            throw new Error('session is empty')
        }

        if (!user.accessToken) {
            throw new Error('accessToken is empty')
        }

        return user.accessToken
    })
}

export const getSessionContext = async () => {
    const token = await getToken().catch(() => false)
    if (!token) {
        return {}
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
}
