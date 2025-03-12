'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
/* Components */
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import type { Post } from '@src/types/wordpress'
import type { Nullable } from '@common/types'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { postOpr, queryPrevNext } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Assets */
import Prev from '@src/images/prev.svg'
import '@src/scss/prev-next.scss'

interface PostProps {
    post: Post
}

export const PrevNextWithPost = (props: PostProps) => {
    const posts = usePrevNext(props.post)
    if (!posts) return <></>
    return <PrevNext posts={[posts[0], posts[1]]} />
}

interface PostsProps {
    posts: [Nullable<Post>, Nullable<Post>]
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

const usePrevNext = (post: Post): Nullable<Post[]> => {
    const [queried, setPosts] = useState<Nullable<Post[]>>()
    useEffect(() => {
        fetchGQL(
            queryPrevNext,
            postOpr,
            WEEK_IN_SECONDS,
            post.id,
            post.date / 1000,
            post.categories.map((category) => category.slug).join(','),
        )
            .then((result) => setPosts(result))
            .catch(() => setPosts([]))
    }, [post])
    return queried
}
