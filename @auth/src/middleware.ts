import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
/* Models */
import { Logger } from '@sujin/share/model/Logger'

const allowed = JSON.parse(`${process.env.CORS_ORIGINS}`)
const ACCESS_SECRET = `${process.env.ACCESS_SECRET}`

const getOrigin = (url?: string) => {
    return new URL(`${url}`).origin
}

export const allowReferer = (req: Request, res: Response, next: NextFunction) => {
    if (allowed.indexOf(getOrigin(req.headers.referer)) !== -1) {
        next()
    } else {
        Logger.error(`🤬 The request is not from allowed referer ${req.headers.referer}`)
        res.status(404).send('You are Sorry')
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query

    if (!token) {
        Logger.error(`🤬 The request is not with verifying token. ${req.headers.referer}`)
        res.status(404).send('You are Sorry.')
        return
    }

    try {
        jwt.verify(token.toString(), ACCESS_SECRET)
    } catch {
        Logger.error(`🤬 The verifying token has problem. ${req.headers.referer}`)
        res.status(404).send('You are Sorry.')
        return
    }
    next()
}

export const verifyRedirection = (req: Request, res: Response, next: NextFunction) => {
    let redirect = req.session.redirect?.toString()
    let origin: string

    if (!redirect) {
        redirect = req.query.redirect?.toString()
    }

    if (!redirect) {
        Logger.error(`🤬 The request is not with redirection info. ${req.headers.referer}`)
        res.status(404).send('You are Sorry.')
        return
    }

    try {
        origin = getOrigin(redirect.toString())
    } catch {
        Logger.error(`🤬 The redirection info is not valid URL. ${req.headers.referer}`)
        res.status(404).send('You are Sorry.')
        return
    }

    if (allowed.indexOf(origin) !== -1) {
        req.session.redirect = redirect.toString()
        next()
        return
    }

    Logger.error(`🤬 The redirection is not from allowed referer ${req.headers.referer}`)
    res.status(404).send('You are Sorry')
}
