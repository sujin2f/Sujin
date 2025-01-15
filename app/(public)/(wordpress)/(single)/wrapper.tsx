'use client'

import React, { useEffect } from 'react'

import { useContext } from '@src/store'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { MenuNames } from '@src/constants/mysql-query'
import { Post as PostType } from '@src/types/wordpress'
import { Post } from '@app/components/single/Post'
import { Page } from '@app/components/single/Page'

type Props = {
    post: PostType
    isPost: boolean
}

export const Wrapper = (props: Props) => {
    const { post, isPost } = props
    const [, dispatch] = useContext()

    useEffect(() => {
        dispatch(setMenu(MenuNames.MAIN))
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: post.title,
                excerpt: post.excerpt,
                icon: post.images.icon,
                prefix: undefined,
                background: post.images.background,
                backgroundColor: post.meta.backgroundColor,
            }),
        )
    }, [
        dispatch,
        post.excerpt,
        post.images.background,
        post.images.icon,
        post.meta.backgroundColor,
        post.title,
    ])

    const thumbnail =
        post.images.list?.url || post.images.thumbnail?.url || '/thumbnail.png'

    return isPost ? (
        <Post post={post} thumbnail={thumbnail} />
    ) : (
        <Page post={post} thumbnail={thumbnail} />
    )
}
