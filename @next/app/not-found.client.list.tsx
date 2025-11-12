'use client'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Cards } from '@lib/components/archive/Cards'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
import { PER_PAGE } from '@lib/constants'
import { ARCHIVE_POSTS } from '@lib/constants/graphql-fields'
import { T_ArchivePost } from '@sujin/lib/types'

const GET_RECENT = gql`query recent { recent { ${ARCHIVE_POSTS} } }`

export function NotFoundList() {
    const { error, loading, data } = useQuery<{ recent: T_ArchivePost[] }>(
        GET_RECENT,
    )

    if (error) {
        return <></>
    }

    if (loading) {
        return <LoadingArchive />
    }

    if (!data) {
        return <></>
    }

    const posts = {
        list: data.recent.slice(0, PER_PAGE),
        pages: 0,
    }

    return (
        <>
            {data.recent.length && (
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
