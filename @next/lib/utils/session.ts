import jwt from 'jsonwebtoken'
import { getServerSession, type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
/* Utils */
import { login } from '@lib/apollo/mutation/login'
/* T_Types */
import type { T_SessionUser } from '@sujin/lib/types'
import { DAY_IN_SECONDS } from '@sujin/share/constants/datetime'

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
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token }) {
            if (token && token.email) {
                let expired = !token.gqlToken
                if (!expired) {
                    // verify gqlToken
                    try {
                        // TODO JWT_SECRET is shared env
                        jwt.verify(
                            token.gqlToken as string,
                            process.env.JWT_SECRET || '',
                        )
                    } catch {
                        expired = true
                    }
                }

                // refresh gqlToken
                if (expired) {
                    const credential = await login(token.email).catch(() => {})
                    if (!credential) {
                        token.gqlToken = ''
                        return token
                    }
                    token.gqlToken = credential
                }
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    gqlToken: token.gqlToken,
                } as T_SessionUser,
            }
        },
    },
} satisfies AuthOptions

export const getSession = async () => await getServerSession(authOptions)

/**
 *
 * @returns {Promise<T_Stringify<T_SessionUser>>}
 * @throws {UnauthorizedError}
 */
const getCurrentUser = async (): Promise<T_SessionUser | undefined> => {
    const session = await getSession().catch(() => undefined)
    if (!session || !session.user) return
    return session.user
}

export const isAdmin = async (): Promise<boolean> =>
    await getToken().then((token) => {
        try {
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

        if (!user.gqlToken) {
            throw new Error('gqlToken is empty')
        }

        return user.gqlToken
    })
}
