'use client'
import React, { useEffect, useState } from 'react'
/* Components */
import { PrevNext } from '@app/(single)/_components/PrevNext'
/* Types */
import type { T_PrevNext } from '@app/_lib/types'
import type { Nullable } from '@common/types'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
/* Assets */
import './style.scss'

interface PostProps {
    slug: string
}

export const PrevNextClient = ({ slug }: PostProps) => {
    const posts = usePrevNext(slug)
    if (!posts) return <></>
    return <PrevNext prev={posts[0] || false} next={posts[1] || false} />
}

const usePrevNext = (slug: string): Nullable<T_PrevNext[]> => {
    const [queried, setPosts] = useState<Nullable<T_PrevNext[]>>()
    useEffect(() => {
        fetchGQL(GQL.queryPrevNext, 'title link', WEEK_IN_SECONDS, slug)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [slug])
    return queried
}
