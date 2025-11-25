import type { SessionOptions } from 'express-session'
/* CONSTANTS */
import { MINUTE_IN_MS } from '@sujin/share/constants/datetime'

// Session for saving redirect URL
export const sessionOption: SessionOptions = {
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * MINUTE_IN_MS,
        sameSite: 'lax',
        secure: false,
    },
}
