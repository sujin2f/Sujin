import type { T_Login_Token } from '../types'

/**
 * Simple verification.
 *
 * @param   {T_Login_Token} payload - The JWT string to verify (expected to be a GraphQL auth token).
 * @returns {void}          Validation passed
 * @throws  {Error}         If `token` is falsy
 */
export const verifyLoginToken = (payload: T_Login_Token, allowed: string[]): void => {
    if (typeof payload === 'string') {
        throw new Error('🤬 Token is invalid')
    }

    if (typeof payload.sub !== 'string') {
        throw new Error('🤬 Token is invalid')
    }
    const sub = parseInt(payload.sub)
    if (isNaN(sub)) {
        throw new Error('🤬 Token is invalid')
    }

    if (allowed.indexOf(payload.iss) === -1) {
        throw new Error('🤬 Token is invalid')
    }

    return
}
