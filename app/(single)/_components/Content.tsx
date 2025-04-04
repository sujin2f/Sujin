'use client'
import React, { Fragment, PropsWithChildren } from 'react'
/* Helpers */
import { parseContent } from '@app/(single)/utils'
import type { PostType, PageType } from '@app/_lib/types/wordpress'

type Props = {
    post: PostType | PageType
    type: 'page' | 'post'
}

export const Content = (props: PropsWithChildren<Props>) => {
    const {
        post: { id, slug, content },
        type,
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <Fragment>
            <article
                className={`content--${type} content--${decodeURIComponent(
                    slug,
                )} content--post-${id} content`}
            >
                {contents}
            </article>
            <footer className="content__footer">{children}</footer>
        </Fragment>
    )
}
