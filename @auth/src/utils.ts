import axios from 'axios'
/* T_Types */
import type { T_GoogleUser } from '@sujin/lib/types'
/* CONSTANTS */
import { HEADER_TOKEN } from '@sujin/lib/constants'
/* Utils */
import { generateToken } from '@sujin/lib/utils/token'

const INTER_COM_SECRET = `${process.env.INTER_COM_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

export const gqlLogin = async (user: T_GoogleUser): Promise<string> => {
    const endpoint = `${process.env.GQL_ENDPOINT}`

    const query = `
        mutation {
            login(email: "${user.email}", name: "${user.name}", picture: "${user.picture}")
        }`

    const token = await generateToken(user, 10, INTER_COM_SECRET, CRYPTO_KEY)
    return await axios
        .post(endpoint, { query: query }, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            return response.headers[HEADER_TOKEN].slice(7)
        })
}
