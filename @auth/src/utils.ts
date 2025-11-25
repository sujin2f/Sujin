import axios from 'axios'
import jwt from 'jsonwebtoken'
/* T_Types */
import type { T_User, T_GoogleUser, T_Login_Token } from '@sujin/lib/types'
/* CONSTANTS */
import { HEADER_TOKEN } from '@sujin/lib/constants'

type ReturnTypeLogin = {
    user: T_User
    refresh: string
}
export const gqlLogin = async (user: T_GoogleUser): Promise<ReturnTypeLogin> => {
    const endpoint = `${process.env.GQL_ENDPOINT}`

    const query = `
        mutation {
            login(email: "${user.email}", name: "${user.name}", picture: "${user.picture}") {
                _id
                admin
            }
        }`

    const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
    const payload = { iss: `${process.env.BASE_URL}`, sub: `${new Date().getTime()}` } satisfies T_Login_Token
    const token = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '10m' })
    return (await axios
        .post(endpoint, { query: query }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            return { user: response.data.data.login, refresh: response.headers[HEADER_TOKEN] }
        })) satisfies ReturnTypeLogin
}

export const getOrigin = (url?: string) => {
    try {
        return new URL(`${url}`).origin
    } catch {
        return 'invalid origin'
    }
}
