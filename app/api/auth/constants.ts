import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { addUser, getUser } from '@app/_lib/data/mongo/user'

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
                throw Error('')
            }
            await getUser(email).then(async (user) => {
                if (!user) {
                    await addUser({
                        email,
                        name: name || '',
                        image: image || '',
                    })
                }
            })
            return true
        },
    },
} satisfies AuthOptions
