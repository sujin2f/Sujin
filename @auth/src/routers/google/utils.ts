import axios from 'axios'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* T_Types */
import type { T_GoogleUser } from '@sujin/lib/types'

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = `${process.env.GOOGLE_CLIENT_SECRET}`
const REDIRECT_URI = `${process.env.GOOGLE_REDIRECT_URI}`

export const fetchGoogleUser = async (code: string): Promise<T_GoogleUser> => {
    let profile
    try {
        // Exchange authorization code for access token
        const {
            data: { access_token },
        } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        })

        // Use access_token or id_token to fetch user profile
        const data = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        profile = (data as any).data
    } catch (e) {
        Logger.error('🤬 Fetching Google token has been failed: ', JSON.stringify(e))
        throw new Error('🤬 Fetching Google token has been failed')
    }
    return profile
}
