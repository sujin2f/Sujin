import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { addUser } from '@app/api/auth/_lib/addUser'
import { getUser } from '@app/api/auth/_lib/getUser'
import { UnauthorizedError } from '@common/model/Error'
import type { T_SessionUser } from '@app/_lib/types'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user: { email, name, image } }) {
            if (!email) {
                throw new UnauthorizedError('Log in failed')
            }
            await getUser(email).catch(async () => {
                await addUser(email, name || 'Unknown User', image || '')
            })
            return true
        },
        async jwt({ token, user, account }) {
            if (account && user && user.email) {
                token._id = await getUser(user.email).then((user) => user._id)
            }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token.id as string,
                } as T_SessionUser,
            }
        },
    },
} satisfies AuthOptions
