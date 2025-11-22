// import NextAuth, { type AuthOptions } from 'next-auth'

// const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
// export const authOptions = {
//     providers: [
//         {
//             id: 'sujin',
//             name: 'Sujin',
//             type: 'oauth',
//             authorization: `${process.env.NEXT_AUTH_ENDPOINT}/auth`,
//             token: `${process.env.NEXT_AUTH_ENDPOINT}/auth`,
//             // userinfo: 'https://api.github.com/user',
//             // clientId: process.env.GITHUB_ID,
//             // clientSecret: process.env.GITHUB_SECRET,
//             profile(profile, token) {
//                 console.log('profile ', profile, token)
//                 return {
//                     id: profile.id,
//                     name: profile?.name,
//                 }
//             },
//         },
//     ],
//     debug: true,
//     // session: {
//     //     maxAge: 7 * DAY_IN_SECONDS,
//     // },
//     secret: ACCESS_SECRET,
//     callbacks: {
//         async signIn({ user, account, profile, email, credentials }) {
//             console.log('signIn', user, account, profile, email, credentials)
//             return true
//         },
//         async redirect({ url, baseUrl }) {
//             console.log('redirect', url, baseUrl)
//             return baseUrl
//         },
//         async session({ session, token, user }) {
//             console.log('session', session, token, user)
//             return session
//         },
//         async jwt({ token, user, account, profile }) {
//             console.log('jwt', token, user, account, profile)
//             if (account?.accessToken) {
//                 token.accessToken = account.accessToken
//             }
//             return token
//         },
//         // async jwt({ token: nextToken }) {
//         //     // Google logged in, but not to GQL
//         //     if (nextToken && nextToken.email && !nextToken.accessToken) {
//         //         const refreshToken = jwt.sign(
//         //             {
//         //                 name: nextToken.name,
//         //                 email: nextToken.email,
//         //                 picture: nextToken.picture,
//         //             },
//         //             NEXTAUTH_SECRET,
//         //             {
//         //                 expiresIn: '7d',
//         //             },
//         //         )
//         //         const { _id, accessToken } = await login(refreshToken)
//         //         ;(await cookies()).set('sujin-refresh-token', refreshToken, {
//         //             httpOnly: true,
//         //             secure: process.env.NODE_ENV === 'production',
//         //             maxAge: 7 * DAY_IN_SECONDS,
//         //             path: '/',
//         //             sameSite: 'lax',
//         //         })
//         //         return { ...nextToken, _id, accessToken }
//         //     }
//         //     return { ...nextToken }
//         // },
//         // async session({ session, token }) {
//         //     return {
//         //         ...session,
//         //         user: {
//         //             ...session.user,
//         //             _id: token._id,
//         //             accessToken: token.accessToken,
//         //         } as T_Session,
//         //     }
//         // },
//     },
// } satisfies AuthOptions

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
