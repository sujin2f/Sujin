import { T_User } from '@sujin/lib/types'
import axios from 'axios'

export const gqlLogin = async (email: string): Promise<T_User> => {
    const endpoint = `${process.env.GQL_ENDPOINT}`

    const query = `
        mutation {
            login(email: "${email}") {
                _id
                admin
            }
        }`

    return (await axios.post(endpoint, { query: query }).then((response) => {
        return response.data.data
    })) as T_User
}
