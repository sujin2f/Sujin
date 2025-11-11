import { subtle } from 'node:crypto'
// import { EnvironmentError } from '@sujin/common/model/Error'

const getKey = async () => {
    if (!process.env.CRYPT_JWK) {
        // throw new EnvironmentError('CRYPT_JWK is not defined')
        throw new Error('CRYPT_JWK is not defined')
    }

    const key = {
        key_ops: ['encrypt', 'decrypt'],
        ext: true,
        kty: 'oct',
        k: process.env.CRYPT_JWK,
        alg: 'A256CBC',
    }

    return await subtle.importKey(
        'jwk',
        key,
        {
            name: 'AES-CBC',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt'],
    )
}

const getCryptoKeyAndIv = async () => {
    const iv = Buffer.alloc(16, process.env.NEXTAUTH_SECRET || '')
    const algorithm = {
        name: 'AES-CBC',
        length: 256,
        iv,
    }
    return { algorithm, key: await getKey() }
}

export const encodeText = async (text: string) => {
    const enc = new TextEncoder()
    const message = enc.encode(text)
    const { key, algorithm } = await getCryptoKeyAndIv()
    const encoded = await subtle.encrypt(algorithm, key, message)
    return encoded
}

export const decodeText = async (buffer: BufferSource) => {
    const { key, algorithm } = await getCryptoKeyAndIv()
    const decoded = await subtle.decrypt(algorithm, key, buffer)
    return new TextDecoder().decode(decoded)
}
