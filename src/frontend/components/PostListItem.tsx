/*
 * Simple Post Component
 * components/common/SimplePost
 */

import React from 'react'

import { Link, Tags } from 'src/frontend/components'
import { Post } from 'src/types'
// import { parseExImage } from 'src/frontend/utils/common'

interface Props {
    item: Post
    className?: string
    thumbnailKey?: {
        desktop?: 'large' | 'medium' | 'small' | 'tiny'
        mobile?: 'large' | 'medium' | 'small' | 'tiny'
    }
}

export const PostListItem = (props: Props): JSX.Element => {
    const {
        // item: { title, thumbnail, link, date, meta, excerpt, tags },
        item: { title, link, date, excerpt, tags },
        className,
        // thumbnailKey = {},
    } = props

    // const backgroundImage = parseExImage(
    //     meta.list,
    //     thumbnail,
    //     thumbnailKey.desktop || 'medium',
    //     thumbnailKey.mobile || 'small',
    //     DEFAULT_BG,
    //     DEFAULT_BG,
    // )

    const jsDate = new Date(date)

    return (
        <div className={`simple-post ${className}`}>
            <figure className="thumbnail">
                <Link to={link} rel="noopener noreferrer" title={title}>
                    <div className="zoom-icon" />
                    <div className="inner-shadow" />
                    <time dateTime={new Date(date).toString()}>
                        <span className="day">{jsDate.getDate()}</span>
                        <span className="month">{jsDate.getMonth() + 1}</span>
                        <span className="year">{jsDate.getFullYear()}</span>
                    </time>
                    {/* <div
                        style={{ backgroundImage: `url('${backgroundImage}')` }}
                        className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                    /> */}
                </Link>
            </figure>

            <div>
                <h2 itemProp="headline">
                    <Link
                        to={link}
                        rel="noopener noreferrer"
                        title={title}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                </h2>

                <div
                    itemProp="description"
                    className="description"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />

                <Tags items={tags} prefix={`archive-item-${title}`} />
            </div>
        </div>
    )
}
