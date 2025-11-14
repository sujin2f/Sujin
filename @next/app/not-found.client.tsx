'use client'
import { use } from 'react'
/* Components */
import { Cards } from '@lib/components/archive/Cards'
/* CONSTANTS */
import { PER_PAGE } from '@lib/constants'
/* T_Types */
import { T_ArchivePost } from '@sujin/lib/types'

type Props = {
    promise: Promise<T_ArchivePost[]>
}

export function NotFoundClient({ promise }: Props) {
    const data = use(promise)

    const posts = {
        list: data.slice(0, PER_PAGE),
        numPages: 0,
    }

    return (
        <>
            {data.length && (
                <Cards
                    posts={posts}
                    keyPrefix="not-found"
                    large={4}
                    medium={6}
                    small={12}
                />
            )}
        </>
    )
}
