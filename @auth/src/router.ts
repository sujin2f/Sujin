import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import { Logger } from '@sujin/share/model/Logger'
import { SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { gqlLogin } from '@src/gqlRequest'
import type { T_Token } from '@sujin/lib/types'
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from '@sujin/lib/constants'

declare module 'express-session' {
    interface SessionData {
        redirect: string
    }
}

const routes = express.Router()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = `${process.env.GOOGLE_CLIENT_SECRET}`
const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`
const REFRESH_SECRET = `${process.env.REFRESH_SECRET}` // TODO Move refresh token to GraphQL
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
    const redirect = req.session.redirect

    if (!redirect) {
        res.status(404).send('You are Sorry.')
        return
    }

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
        // TODO Error
        res.redirect(decodeURI(redirect))
        return
    }

    const user = await gqlLogin(profile.email).catch((e) => {
        Logger.error('🤬 Fetching GQL has been failed: ', JSON.stringify(e))
        // TODO Error
        res.redirect(decodeURI(redirect))
    })

    if (!user) {
        // TODO Error
        Logger.error('🤬 User does not exist.')
        res.redirect(decodeURI(redirect))
        return
    }

    const iat = new Date().getTime() / SECOND_IN_MS
    const sub = JSON.stringify({
        _id: user._id,
        name: profile.name as string,
        picture: `${profile.picture}`,
        email: profile.email as string,
        admin: user.admin,
    })

    const tokenInfo: T_Token = {
        iss: 'https://sujinc.com',
        iat,
        sub,
        exp: 0,
    }

    const accessToken = jwt.sign({ ...tokenInfo, exp: iat + ACCESS_TOKEN_LIFETIME }, ACCESS_SECRET)
    const refreshToken = jwt.sign({ ...tokenInfo, exp: iat + REFRESH_TOKEN_LIFETIME }, REFRESH_SECRET)

    // Redirect to destination
    res.cookie('x-token-at', accessToken, { maxAge: 20 * SECOND_IN_MS })
    res.cookie('x-token-rt', refreshToken, { maxAge: 20 * SECOND_IN_MS })
    Logger.info('🤟 User authentication!')
    res.redirect(decodeURI(redirect))
})

export const authRoutes = routes
