// import { createHash } from 'node:crypto'

// export const createEmailHash = (email: string) => {
//     if (!process.env.NEXTAUTH_SECRET) {
//         return ''
//     }

//     return createHash('md5')
//         .update(email)
//         .update(process.env.NEXTAUTH_SECRET)
//         .digest('hex')
// }
