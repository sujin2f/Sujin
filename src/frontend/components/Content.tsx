/*
 * Content Component
 * components/single/Content
 */

import React, { Fragment } from 'react'

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
