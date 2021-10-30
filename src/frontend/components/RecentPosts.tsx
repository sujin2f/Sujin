/** components/widgets/RecentPosts */
import React, { Fragment } from 'react'

import { PostListItem } from 'src/frontend/components'
import { useArchive } from 'src/frontend/hooks'
import { Post } from 'src/types'

interface Props {
    small: number
    medium: number
    large: number
}

export const RecentPosts = (props: Props): JSX.Element => {
    return <Fragment />
    // const archive = useArchive('recent-posts', 'recentPosts', 1, false)

    // if (!archive || 'Success' !== archive.state) {
    //     return <Fragment />
    // }

    // return (
    //     <section className="widget recent-posts row">
    //         {archive.item &&
    //             archive.item.items &&
    //             archive.item.items.map((item: Post) => (
    //                 <SimplePost
    //                     key={`recent-post-id-${item.slug}`}
    //                     className={`column small-${props.small} medium-${props.medium} large-${props.large}`}
    //                     item={item}
    //                     thumbnailKey={{ desktop: 'small', mobile: 'small' }}
    //                 />
    //             ))}
    //     </section>
    // )
}
