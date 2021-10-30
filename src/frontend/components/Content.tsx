/*
 * Content Component
 * components/single/Content
 */

import React from 'react'

import { Post, ReactChildrenProps } from 'src/types'
import { parseContent } from 'src/frontend/utils/single'

interface Props extends ReactChildrenProps {
    post: Post
    className?: string
}

export const Content = (props: Props): JSX.Element => {
    const {
        post: { id, slug, content, type },
        className,
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <article
            className={`${className} content--${type}-${slug} content--post-${id} content`}
            itemProp="mainEntity"
        >
            {contents}

            <footer className="content__footer">{children}</footer>
        </article>
    )
}
