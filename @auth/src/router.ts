import express from 'express'
import jwt from 'jsonwebtoken'

import { Logger } from '@sujin/share/model/Logger'
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import type { T_Token } from '@sujin/lib/types'
import { ACCESS_TOKEN_LIFETIME } from '@sujin/lib/constants'
import { fetchGoogleUser, gqlLogin } from '@src/utils'

declare module 'express-session' {
    interface SessionData {
        redirect: string
    }
}

const routes = express.Router()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REDIRECT_URI = `${process.env.REDIRECT_URI}`
const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`

routes.get('/auth', (req, res) => {
    // Store redirect URL from request
    const { redirect, token: _token } = req.query
    if (!redirect || !_token) {
        res.status(404).send('You are Sorry.')
        return
    }

    // Verify token & save redirect to session
    // TODO error handling
    jwt.verify(_token as string, ACCESS_SECRET)
    req.session.redirect = redirect as string

    Logger.info('🤟 Start user authentication')
    res.redirect(OAUTH_URL)
})

const redirectPath = new URL(REDIRECT_URI).pathname
// Callback URL for handling the Google Login response
routes.get(redirectPath, async (req, res) => {
    const { code } = req.query

    const redirect = req.session.redirect // TODO destroy session
    if (!redirect) {
        res.status(404).send('You are Sorry.')
        return
    }

    // Google
    const google = await fetchGoogleUser(code as string).catch(() => null)
    if (!google) {
        res.redirect(decodeURI(redirect))
        return
    }

    // @graphql
    const result = await gqlLogin(google).catch((e) => {
        Logger.error('🤬 Fetching GQL has been failed: ', JSON.stringify(e))
        // TODO Error
        res.redirect(decodeURI(redirect))
    })
    if (!result) {
        Logger.error('🤬 User does not exist.')
        res.redirect(decodeURI(redirect))
        return
    }
    const { user, refresh } = result

    // issue access token
    const iat = new Date().getTime() / SECOND_IN_MS
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
    res.cookie('x-token-rt', refresh, { maxAge: 10 * SECOND_IN_MS })

    Logger.info('🤟 User authentication!')
    res.redirect(decodeURI(redirect))
})

export const authRoutes = routes
