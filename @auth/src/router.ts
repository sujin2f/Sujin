import express from 'express'
import axios from 'axios'
import jwt from 'jsonwebtoken'

import { Logger } from '@sujin/share/model/Logger'
import { DAY_IN_SECONDS, HOUR_IN_SECONDS, MINUTE_IN_SECONDS, SECOND_IN_MS } from '@sujin/share/constants/datetime'
import { gqlLogin } from '@src/gqlRequest'
import type { T_Token } from '@sujin/lib/types'

declare module 'express-session' {
    interface SessionData {
        redirect: string
    }
}

const routes = express.Router()

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = `${process.env.REDIRECT_URI}`
const OAUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`

routes.get('/auth', (req, res) => {
    // Store redirect URL from request
    const { redirect } = req.query
    req.session.redirect = JSON.stringify(redirect)
    res.redirect(OAUTH_URL)
})

const redirectPath = new URL(REDIRECT_URI).pathname
// Callback URL for handling the Google Login response
routes.get(redirectPath, async (req, res) => {
    const { code } = req.query
    // // TODO default URL
    // const redirect = req.session.redirect || 'http://localhost:8000'

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
        res.redirect('http://localhost:8010')
        return
    }

    const user = await gqlLogin(profile.email).catch(() => {
        // TODO Error
        res.redirect('http://localhost:8010')
    })

    if (!user) {
        // TODO Error
        res.redirect('http://localhost:8010')
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
        exp: iat + 3 * HOUR_IN_SECONDS,
        sub,
    }

    const accessToken = jwt.sign(tokenInfo, `${process.env.ACCESS_SECRET}`, {
        expiresIn: '3h',
    })
    const refreshToken = jwt.sign({ ...tokenInfo, exp: iat + 30 * DAY_IN_SECONDS }, `${process.env.REFRESH_SECRET}`, {
        expiresIn: '30d',
    })
    const token = jwt.sign(
        {
            accessToken,
            refreshToken,
            exp: iat + 10 * MINUTE_IN_SECONDS,
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn: '10m',
        },
    )

    // Redirect to destination
    res.setHeader('Authentication', `Bearer ${token}`)
    res.redirect('http://localhost:8010')
})

export const authRoutes = routes
