import addUser from '@src/db/mongo/admin/addUser'
import getUser from '@src/db/mongo/admin/getUser'
import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }) {
            await getUser(user.email || '').catch(async () => {
                await addUser(user)
            })
            return true
        },
    },
} satisfies AuthOptions

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
