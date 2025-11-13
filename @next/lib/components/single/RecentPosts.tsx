'use client'
/* Components */
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { Cards } from '@lib/components/archive/Cards'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
// import useGQLStore from '@sujin/common/hooks/useGQLStore'
/* CONSTANTS */
import { IMAGE_SIZE } from '@sujin/lib/types'
// import GQL from '@app/api/graphql/_lib/constants'
import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
// import { Context } from '@app/_lib/constants.store'
/* Assets */
import './RecentPosts.scss'

export const RecentPosts = ({ id }: { id: number }) => {
    return <></>
    // const { items, pending, error } = useGQLStore(
    //     'recent',
    //     Context,
    //     GQL.queryRecent,
    //     `
    //     id slug title excerpt date link
    //     images {
    //         list { url mimeType width height sizes { postThumbnail { url width height mimeType } recentPost { url width height mimeType } } }
    //         thumbnail { url mimeType width height sizes { postThumbnail { url width height mimeType } recentPost { url width height mimeType } } }
    //     }
    //     archives { title slug type }
    //     `,
    //     WEEK_IN_SECONDS,
    // )

    // if (error) {
    //     return <></>
    // }

    // if (pending) {
    //     return <LoadingArchive small={12} counts={4} />
    // }

    // const posts = {
    //     list: items
    //         .filter((item) => item.id !== id)
    //         .slice(0, 4)
    //         .map((item) => ({
    //             ...item,
    //             date: new Date(parseInt(item.date.toString())),
    //         })),
    //     pages: 0,
    // }

    // return (
    //     <section className="recent-posts show-for-large">
    //         <WidgetTitle>Recent Posts</WidgetTitle>
    //         {pending && <Loading small={12} counts={4} />}
    //         {!pending && !error && (
    //             <Cards
    //                 posts={posts}
    //                 keyPrefix="recent"
    //                 imageSize={IMAGE_SIZE.RECENT_POST}
    //             />
    //         )}
    //     </section>
    // )
}
