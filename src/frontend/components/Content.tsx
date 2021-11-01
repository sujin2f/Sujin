/*
 * Content Component
 * components/single/Content
 */

import React, { Fragment } from 'react'

import { parseContent } from 'src/frontend/utils/single'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Post, ReactChildrenProps } from 'src/types'

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
        <Fragment>
            <div className={className}>
                <article
                    className={`content--${type}-${decodeURIComponent(
                        slug,
                    )} content--post-${id} content`}
                >
                    {contents}
                </article>
                <footer className="content__footer">{children}</footer>
            </div>
        </Fragment>
    )
}
