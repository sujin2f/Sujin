import express from 'express'
import jwt from 'jsonwebtoken'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* CONSTANTS */
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { ACCESS_TOKEN_LIFETIME } from '@sujin/lib/constants'
/* T_Types */
import type { T_Token, T_Login_Token } from '@sujin/lib/types'
/* Utils */
import { getOrigin, gqlLogin } from '@src/utils'
import { fetchGoogleUser } from '@src/routers/google/utils'
import { verifyLoginToken } from '@sujin/lib/utils/token'

declare module 'express-session' {
    interface SessionData {
        redirect: string
    }
}

const routes = express.Router()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REDIRECT_URI = `${process.env.GOOGLE_REDIRECT_URI}`
const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`

const allowed = JSON.parse(`${process.env.CORS_ORIGINS}`)

routes.get('/google/auth', (req, res) => {
    Logger.info('🤟 Start user authentication')
    // Validate referer
    if (allowed.indexOf(getOrigin(req.headers.referer)) === -1) {
        Logger.error(`🤬 The request is not from allowed referer ${req.headers.referer}`)
        res.status(404).send('You are Sorry')
        return
    }

    // // Validate token
    const { token, redirect } = req.query
    if (!token) {
        Logger.error(`🤬 The request is not with verifying token.`)
        res.status(404).send('You are Sorry.')
        return
    }
    try {
        const payload = jwt.verify(token.toString(), ACCESS_SECRET) as T_Login_Token
        verifyLoginToken(payload, allowed)
    } catch {
        Logger.error(`🤬 The verifying token has problem.`)
        res.status(404).send('You are Sorry.')
        return
    }

    // Validate redirection
    if (!redirect) {
        Logger.error(`🤬 The request is not with redirection info.`)
        res.status(404).send('You are Sorry.')
        return
    }
    let origin: string
    try {
        origin = getOrigin(redirect.toString())
    } catch {
        Logger.error(`🤬 The redirection info is not valid URL. ${redirect.toString()}`)
        res.status(404).send('You are Sorry.')
        return
    }
    if (allowed.indexOf(origin) === -1) {
        Logger.error(`🤬 The redirection is not from allowed referer ${redirect}`)
        res.status(404).send('You are Sorry')
        return
    }

    req.session.redirect = redirect.toString()
    Logger.info('🤟 redirection URL is:'.toString())
    res.redirect(OAUTH_URL)
})

const redirectPath = new URL(REDIRECT_URI).pathname
// Callback URL for handling the Google Login response
routes.get(redirectPath, async (req, res) => {
    // Validate redirection
    let origin: string
    const redirect = req.session.redirect?.toString()
    if (!redirect) {
        Logger.error(`🤬 The request is not with redirection info.`)
        res.status(404).send('You are Sorry.')
        return
    }
    try {
        origin = getOrigin(redirect.toString())
    } catch {
        Logger.error(`🤬 The redirection info is not valid URL. ${redirect.toString()}`)
        res.status(404).send('You are Sorry.')
        return
    }
    if (allowed.indexOf(origin) === -1) {
        Logger.error(`🤬 The redirection is not from allowed referer ${redirect}`)
        res.status(404).send('You are Sorry')
        return
    }

    req.session.destroy(() => {})

    // Google
    const { code } = req.query
    const google = await fetchGoogleUser(code as string).catch(() => null)
    if (!google) {
        Logger.error('🤬 Fetching Google has been failed')
        res.redirect(decodeURI(redirect))
        return
    }

    // @graphql
    const result = await gqlLogin(google).catch((e) => {
        Logger.error('🤬 Fetching GQL has been failed: ', JSON.stringify(e))
        res.redirect(decodeURI(redirect))
    })

    if (!result) {
        res.redirect(decodeURI(redirect))
        return
    }
    const { user, refresh } = result

    // issue access token
    const iat = Math.trunc(new Date().getTime() / SECOND_IN_MS)
    const sub = JSON.stringify({
        ...google,
        ...user,
    })
    const tokenInfo: T_Token = {
        iss: 'https://sujinc.com',
        iat,
        sub,
        exp: iat + ACCESS_TOKEN_LIFETIME,
    }
    const access = jwt.sign(tokenInfo, ACCESS_SECRET)

    // ship to cookie
    res.cookie('x-token-at', access, { maxAge: 10 * SECOND_IN_MS })
    res.cookie('x-token-rt', refresh.slice(7), { maxAge: 10 * SECOND_IN_MS })

    Logger.info('🤟 User authentication!')
    res.redirect(decodeURI(redirect))
})

export const googleRoutes = routes
