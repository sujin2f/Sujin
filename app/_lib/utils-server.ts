import { subtle } from 'node:crypto'
import { headers } from 'next/headers'

import type { Nullable } from '@common/types'
import { Metadata, METADATA } from '@app/_lib/constants'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import { COLLECTION } from '@app/_lib/types'
import { EnvironmentError } from '@common/model/Error'

/**
 * Retrieves the current pathname from the headers.
 *
 * This function fetches the value of the `x-pathname` header and returns it.
 * If the header is not found, it returns `undefined`.
 *
 * @async
 * @returns {Promise<Nullable<string>>} The pathname as a string if found, otherwise `undefined`.
 */
const getPathName = async (): Promise<Nullable<string>> =>
    (await headers()).get('x-pathname') || undefined

/**
 * Retrieves metadata based on the current pathname.
 *
 * This function fetches the current pathname from the headers and looks up
 * the corresponding metadata from the `METADATA` object. If the pathname
 * is not available or the metadata is not found for the given path, an error
 * is thrown.
 *
 * @async
 * @returns {Promise<Metadata>} The metadata corresponding to the current pathname.
 * @throws {Error} If the pathname is not found or metadata for the path is missing.
 */
export const getMetaData = async (): Promise<Metadata> => {
    const path = await getPathName()
    if (!path || !METADATA[path]) {
        throw Error('Cannot get metadata.')
    }
    return METADATA[path]
}

export const getAggregation = (
    key: 'paging' | '_id' | 'expand-archive' | 'to-archive-post',
    ...arr: (string | number)[]
) => {
    switch (key) {
        case 'paging':
            if (typeof arr[0] === 'number') {
                return [
                    {
                        $sort: { date: -1 },
                    },
                    {
                        $skip: PER_PAGE * (arr[0] - 1),
                    },
                    {
                        $limit: PER_PAGE,
                    },
                ]
            }

        case '_id':
            if (arr[0]) {
                return [
                    {
                        $addFields: {
                            [arr[0]]: { $toString: `$${arr[0]}` },
                        },
                    },
                ]
            }

            return [
                {
                    $addFields: {
                        _id: { $toString: '$_id' },
                    },
                },
            ]

        case 'expand-archive':
            return [
                {
                    $lookup: {
                        from: COLLECTION.ARCHIVE,
                        localField: 'archives',
                        foreignField: '_id',
                        as: 'archives',
                        pipeline: [
                            {
                                $addFields: {
                                    _id: { $toString: '$_id' },
                                },
                            },
                        ],
                    },
                },
            ]
        case 'to-archive-post':
            return [
                {
                    $project: {
                        content: 0,
                        meta: 0,
                    },
                },
            ]
    }

    return []
}

export const getKey = async () => {
    if (!process.env.CRYPT_JWK) {
        throw new EnvironmentError('CRYPT_JWK is not defined')
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
