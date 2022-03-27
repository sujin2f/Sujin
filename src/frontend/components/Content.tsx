/*
 * Content Component
 * components/single/Content
 */

import React, { Fragment, PropsWithChildren } from 'react'

import { parseContent } from 'src/frontend/utils/single'
import type { Post } from 'src/types'

type Props = {
    post: Post
    className?: string
}

export const Content = (props: PropsWithChildren<Props>): JSX.Element => {
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
