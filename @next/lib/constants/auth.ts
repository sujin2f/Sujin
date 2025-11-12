import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
// import { addUser, getUser } from '@app/api/auth/_lib/utils-mongo'
import { UnauthorizedError } from '@sujin/share/model/Error'
import type { T_SessionUser } from '@sujin/lib/types'

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
            // await getUser(email).catch(async () => {
            //     await addUser(email, name || 'Unknown User', image || '')
            // })
            return true
        },
        async jwt({ token }) {
            // if (token && token.email && !token._id) {
            //     token._id = await getUser(token.email).then((user) => user._id)
            // }
            return token
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token._id as string,
                } as T_SessionUser,
            }
        },
    },
} satisfies AuthOptions
