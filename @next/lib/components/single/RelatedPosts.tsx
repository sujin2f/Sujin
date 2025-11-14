'use client'
import React, { useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

/* Modules */
import { client } from '@lib/apollo/apollo-client-frontend'
/* Components */
import { WidgetTitle } from '../WidgetTitle'
import { Cards } from '../archive/Cards'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* CONSTANTS */
import { FIELDS } from '@lib/constants/graphql-fields'
/* T_Type */
import type { T_ArchivePost } from '@sujin/lib/types'
/* Assets */
import './RelatedPosts.scss'

type Props = {
    slug: string
}

export const RelatedPosts = ({ slug }: Props) => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ related: T_ArchivePost[] }>(
        gql`
            query Related($slug: String!) {
                related(slug: $slug) { ${FIELDS['POST_ARCHIVE']} }
            }
        `,
        { skip, client, variables: { slug } },
    )
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error || loading || !data) {
        return <></>
    }

    const posts = {
        list: data.related,
        pages: 0,
    }

    return (
        <section className="related-posts">
            <WidgetTitle>Related Posts</WidgetTitle>
            <Cards posts={posts} keyPrefix="related" medium={6} small={12} />
        </section>
    )
}

// import { Suspense } from 'react'
// import { unstable_cache } from 'next/cache'
// import { ObjectId } from 'mongodb'
// /* Components */
// import { WidgetTitle } from '@app/_components/WidgetTitle'
// import { Cards } from '@lib/components/archive/Cards.use'
// import { Loading } from '@app/archive/_components/Loading'
// /* Utils */
// import { getCollection } from '@sujin/common/data/mongo/mongo'
// import { getAggregation } from '@app/_lib/utils/server'
// import { cachedRequest, getCacheKey } from '@sujin/lib/utils/cache'
// import { getCachedPost } from '@app/(single)/_lib/getCachedPost'
// import { getCachedRecentPosts } from '@app/api/graphql/_lib/getCachedRecentPosts'
// /* CONSTANTS */
// import { VERSION } from '@sujin/share/constants/helper'
// import { revalidate } from '@app/_lib/constants'
// import {
//     COLLECTION,
//     POST_STATUS,
//     type T_Post,
//     type T_ArchivePost,
// } from '@app/_lib/types'
/* Assets */
