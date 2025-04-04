'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Types */
import type { PostType } from '@app/_lib/types/wordpress'
import type { Nullable } from '@common/types'
/* Constants */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
/* Assets */
import Prev from '@app/_lib/images/prev.svg'
import './style.scss'

interface PostProps {
    post: PostType
}

export const PrevNextWithPost = (props: PostProps) => {
    const posts = usePrevNext(props.post)
    if (!posts) return <></>
    return <PrevNext posts={[posts[0], posts[1]]} />
}

interface PostsProps {
    posts: [Nullable<PostType>, Nullable<PostType>]
}

export const PrevNext = (props: PostsProps) => {
    return (
        <Row dom="nav" fullWidth className="prev-next__container">
            <Column small={12} medium={6} className="prev-next prev-next--prev">
                {props.posts[0] && (
                    <Link
                        href={props.posts[0].link}
                        className="prev-next__link"
                    >
                        <Prev />
                        <span className="prev-next__link__title">
                            {props.posts[0].title}
                        </span>
                    </Link>
                )}
            </Column>
            <Column small={12} medium={6} className="prev-next prev-next--next">
                {props.posts[1] && (
                    <Link
                        href={props.posts[1].link}
                        className="prev-next__link"
                    >
                        <Prev />
                        <span className="prev-next__link__title">
                            {props.posts[1].title}
                        </span>
                    </Link>
                )}
            </Column>
        </Row>
    )
}

const usePrevNext = (post: PostType): Nullable<PostType[]> => {
    const [queried, setPosts] = useState<Nullable<PostType[]>>()
    useEffect(() => {
        fetchGQL(GQL.queryPrevNext, GQL.postOpr, WEEK_IN_SECONDS, post.slug)
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [post])
    return queried
}
