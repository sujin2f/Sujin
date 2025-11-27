import { createHash as nodeCreateHash, getRandomValues, subtle } from 'node:crypto'

/**
 * Creates an MD5 hash of a string with a secret.
 * @param {string} str The string to hash.
 * @param {string} secret The secret to use in hashing.
 * @returns {string} The MD5 hash in hexadecimal format.
 */
export const createHash = (str: string, secret: string): string => {
    return nodeCreateHash('md5').update(str).update(secret).digest('hex')
}

/**
 * Simple same-key encode/decode
 * @returns base64 encoded string of JSON array. [k, iv(base64 array buffer)]
 */
export const generateKey = async () => {
    const key = await subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
    const exported = await subtle.exportKey('jwk', key)
    const iv = getRandomValues(new Uint8Array(12))
    const merged = JSON.stringify([exported.k, bufferToBase64(iv.buffer)])
    return btoa(merged)
}

export const encodeText = async (text: string, secret: string): Promise<string> => {
    const [k, _iv] = JSON.parse(atob(secret))
    const iv = base64ToArrayBuffer(_iv)

    const key = await subtle.importKey(
        'jwk',
        { key_ops: ['encrypt', 'decrypt'], ext: true, alg: 'A256GCM', kty: 'oct', k },
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
    )
    const encodedData = new TextEncoder().encode(text)
    const buffer = await subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedData)
    return bufferToBase64(buffer)
}

export const decodeText = async (encoded: string, secret: string): Promise<string> => {
    const [k, _iv] = JSON.parse(atob(secret))
    const iv = base64ToArrayBuffer(_iv)

    const key = await subtle.importKey(
        'jwk',
        { key_ops: ['encrypt', 'decrypt'], ext: true, alg: 'A256GCM', kty: 'oct', k },
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
    )

    const decoder = new TextDecoder()
    const data = await subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToArrayBuffer(encoded))
    return decoder.decode(data)
}

const bufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer)

    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64)

    // Get the length of the binary string
    const length = binaryString.length

    // Create a Uint8Array with the same length
    const bytes = new Uint8Array(length)

    // Populate the Uint8Array with the character codes from the binary string
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    // Return the underlying ArrayBuffer of the Uint8Array
    return bytes.buffer
}
