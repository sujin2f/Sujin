import { MINUTE_IN_MS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'

export const sessionOption = {
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * MINUTE_IN_MS,
        httpOnly: true,
        secure: !IS_DEV, // Only secure in production
    },
}
