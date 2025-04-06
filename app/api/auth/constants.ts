import type { User, AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import Mongo from '@common/data/mongo/mongo'
import { COLLECTION } from '@app/_lib/data/types'

const addUser = async (user: User) =>
    await Mongo.insertOne<User>(COLLECTION.USERS, user)

const getUser = async (email: string) =>
    await Mongo.findOne<User>(COLLECTION.USERS, { email })

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
