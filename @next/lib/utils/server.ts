import { headers } from 'next/headers'

import type { Nullable } from '@sujin/share/types'
import { Metadata, METADATA } from '@lib/constants'
import { PER_PAGE } from '@lib/constants'
import { COLLECTION } from '@sujin/lib/constants'

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
