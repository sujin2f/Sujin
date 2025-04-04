import addUser from '@app/helpers/data/mongo/admin/addUser'
import getUser from '@app/helpers/data/mongo/admin/getUser'
import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions = {
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

export default authOptions
