/*
 * Content Component
 * components/single/Content
 */

import React, { Fragment, PropsWithChildren } from 'react'

import { parseContent } from 'src/frontend/utils/single'
import { Post } from 'src/types/wordpress'

type Props = {
    post: Post
}

export const Content = (props: PropsWithChildren<Props>): JSX.Element => {
    const {
        post: { id, slug, content, type },
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <Fragment>
            <article
                className={`content--${type}-${decodeURIComponent(
                    slug,
                )} content--post-${id} content`}
            >
                {contents}
            </article>
            <footer className="content__footer">{children}</footer>
        </Fragment>
    )
}
