import express from 'express'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Utils */
import { gqlLogin } from '@src/utils'
import { fetchGoogleUser } from '@src/routers/google/utils'
import { getTokenSub, generateToken } from '@sujin/lib/utils/token'

declare module 'express-session' {
    interface SessionData {
        redirect: string
    }
}

const routes = express.Router()

const INTER_COM_SECRET = `${process.env.INTER_COM_SECRET}`
const CRYPTO_KEY = `${process.env.CRYPTO_KEY}`

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const REDIRECT_URI = `${process.env.GOOGLE_REDIRECT_URI}`
const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`
const allowed = JSON.parse(`${process.env.AUTH_CORS_ORIGINS}`)

routes.get('/google/auth', async (req, res) => {
    Logger.info(`🤞 Start user authentication`)
    const { token } = req.query

    const redirect: string = await getTokenSub<string>(`${token}`, CRYPTO_KEY)
        .then(async (redirect) => {
            const url = new URL(redirect)
            if (allowed.indexOf(url.origin) === -1) {
                throw new Error(`🤬 The redirection is not from allowed referer ${url.origin}`)
            }
            return redirect
        })
        .catch((e) => {
            Logger.error(e.message)
            res.status(404).send('You are Sorry.')
            return ''
        })

    req.session.redirect = await generateToken(redirect, 60, INTER_COM_SECRET, CRYPTO_KEY)
    res.redirect(OAUTH_URL)
})

const redirectPath = new URL(REDIRECT_URI).pathname
// Callback URL for handling the Google Login response
routes.get(redirectPath, async (req, res) => {
    // validate session from /google/auth
    const redirect: string = await getTokenSub<string>(`${req.session.redirect}`, CRYPTO_KEY)
        .then((redirect) => {
            const url = new URL(redirect)
            if (allowed.indexOf(url.origin) === -1) {
                throw new Error(`🤬 The redirection is not from allowed referer ${redirect}`)
            }
            return redirect
        })
        .catch((e) => {
            Logger.error(e.message)
            res.status(404).send('You are Sorry.')
            return ''
        })

    req.session.destroy(() => {})

    // get Google userinfo
    const { code } = req.query
    const google = await fetchGoogleUser(code as string).catch(() => null)
    if (!google) {
        Logger.error('🤬 Fetching Google has been failed')
        res.redirect(decodeURI(redirect))
        return
    }

    // @graphql
    const token = await gqlLogin(google).catch((e) => {
        Logger.error('🤬 Fetching GQL has been failed: ', JSON.stringify(e))
        res.redirect(decodeURI(redirect))
    })
    if (!token) {
        res.redirect(decodeURI(redirect))
        return
    }

    Logger.info('⭐️ User authentication finished!')
    res.redirect(`${decodeURI(redirect)}?token=${token}`)
})

export const googleRoutes = routes
