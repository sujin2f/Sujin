import { createHash as nodeCreateHash } from 'node:crypto'

/**
 * Creates an MD5 hash of a string with a secret.
 * @param {string} str The string to hash.
 * @param {string} secret The secret to use in hashing.
 * @returns {string} The MD5 hash in hexadecimal format.
 */
export const createHash = (str: string, secret: string) => {
    return nodeCreateHash('md5').update(str).update(secret).digest('hex')
}
