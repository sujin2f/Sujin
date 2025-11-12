'use client'
/* Components */
import { Cards } from '../.backup/archive/_components/Cards'
import { Loading } from '../.backup/archive/_components/Loading'
/* Utils */
import useGQLStore from '@sujin/common/hooks/useGQLStore'
/* CONSTANTS */
import GQL from '../.backup/api/graphql/_lib/constants'
import { Context } from '@app/_lib/constants.store'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
import { PER_PAGE } from './_lib/constants'

export default function NotFoundClient() {
    const { items, pending, error } = useGQLStore(
        'recent',
        Context,
        GQL.queryRecent,
        `
        id slug title excerpt date link
        images {
            list { url mimeType width height sizes { postThumbnail { url width height mimeType } recentPost { url width height mimeType } } }
            thumbnail { url mimeType width height sizes { postThumbnail { url width height mimeType } recentPost { url width height mimeType } } }
        }
        archives { title slug type }
        `,
        WEEK_IN_SECONDS,
    )

    if (error) {
        return <></>
    }

    if (pending) {
        return <Loading />
    }

    const posts = {
        list: items.slice(0, PER_PAGE).map((item) => ({
            ...item,
            date: new Date(parseInt(item.date.toString())),
        })),
        pages: 0,
    }

    return (
        <>
            {items.length && (
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
