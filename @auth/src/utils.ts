import axios from 'axios'
/* T_Types */
import type { T_User, T_GoogleUser } from '@sujin/lib/types'
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

    return (await axios.post(endpoint, { query: query }).then((response) => {
        return { user: response.data.data.login, refresh: response.headers[HEADER_TOKEN] }
    })) satisfies ReturnTypeLogin
}
