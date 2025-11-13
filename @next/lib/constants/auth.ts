import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import type { T_SessionUser } from '@sujin/lib/types'
import { login } from '@lib/apollo/user'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token }) {
            if (token && token.email && !token._id) {
                const credential = await login(token.email).catch(() => {})
                if (!credential) {
                    token.gqlToken = ''
                    return token
                }
                token.gqlToken = credential
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
