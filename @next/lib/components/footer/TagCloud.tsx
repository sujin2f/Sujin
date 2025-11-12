'use client'

import { Fragment } from "react"

// import React from 'react'
// import Link from 'next/link'
// /* Components */
// import { LoadingArchive } from '@lib/components/LoadingArchive'
// /* CONSTANTS */
// import { WEEK_IN_SECONDS } from '@sujin/share/constants/datetime'
// import GQL from '../../../.backup/api/graphql/_lib/constants'
// import { Context } from '@lib/constants/store'
// /* Utils */
// import useIntersectionGQLStore from '@common/hooks/useIntersectionGQLStore'

const TagCloud = () => {
    return <Fragment />
    // const { items, pending, error, ref } = useIntersectionGQLStore(
    //     'tagCloud',
    //     Context,
    //     GQL.queryTagCloud,
    //     'id title slug total hits',
    //     WEEK_IN_SECONDS,
    // )

    // if (error) {
    //     return
    // }

    // return (
    //     <section className="widget--tag-cloud" ref={ref}>
    //         {pending && (
    //             <LoadingArchive
    //                 fullWidth
    //                 className="tag-cloud"
    //                 counts={1}
    //                 small={12}
    //             />
    //         )}
    //         {items.length &&
    //             items.slice(0, 20).map((tag) => (
    //                 <Link
    //                     className={`tag-cloud tag-cloud--size-${tag.total} tag-cloud--color-${tag.hits}`}
    //                     key={`tag-cloud-${tag.slug}-${tag.title}`}
    //                     title={tag.title}
    //                     href={`/tag/${tag.slug}`}
    //                 >
    //                     {tag.title}
    //                 </Link>
    //             ))}
    //     </section>
    // )
}
export default TagCloud
