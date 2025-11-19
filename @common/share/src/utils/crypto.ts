import { subtle, createHash as nodeCreateHash } from 'node:crypto'

const getKey = async (secret: string) => {
    const key = {
        key_ops: ['encrypt', 'decrypt'],
        ext: true,
        kty: 'oct',
        k: secret,
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

const getCryptoKeyAndIv = async (secret: string) => {
    const iv = Buffer.alloc(16, process.env.NEXTAUTH_SECRET || '')
    const algorithm = {
        name: 'AES-CBC',
        length: 256,
        iv,
    }
    return { algorithm, key: await getKey(secret) }
}

export const encodeText = async (text: string, secret: string) => {
    const enc = new TextEncoder()
    const message = enc.encode(text)
    const { key, algorithm } = await getCryptoKeyAndIv(secret)
    const encoded = await subtle.encrypt(algorithm, key, message)
    return encoded
}

export const decodeText = async (buffer: Buffer, secret: string) => {
    const { key, algorithm } = await getCryptoKeyAndIv(secret)
    const decoded = await subtle.decrypt(algorithm, key, buffer)
    return new TextDecoder().decode(decoded)
}

export const createHash = (str: string, secret: string) => {
    return nodeCreateHash('md5').update(str).update(secret).digest('hex')
}
