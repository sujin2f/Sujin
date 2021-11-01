/*
 * Simple Post Component
 * components/common/SimplePost
 */

import React from 'react'
import { ImageType } from 'src/constants'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import { Link, Tags } from 'src/frontend/components'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Post } from 'src/types'
import { getImageMap } from 'src/utils'

interface Props {
    item: Post
    className?: string
    thumbnailKey?: {
        desktop?: 'large' | 'medium' | 'small' | 'tiny'
        mobile?: 'large' | 'medium' | 'small' | 'tiny'
    }
}

export const ListItem = (props: Props): JSX.Element => {
    const {
        item: { title, link, date, excerpt, tags, images },
        className,
    } = props

    const jsDate = new Date(date)
    const image = images.list || images.thumbnail
    const imageMapThumbnail = image
        ? getImageMap(ImageType.HEADER, image.sizes)
        : []

    return (
        <div className={`list-item ${className}`}>
            <figure className="list-item__thumbnail">
                <Link to={link} title={title}>
                    <div className="list-item__zoom" />
                    <div className="list-item__shadow" />
                    <time
                        className="list-item__time"
                        dateTime={new Date(date).toString()}
                    >
                        <span className="list-item__day">
                            {jsDate.getDate()}
                        </span>
                        <span className="list-item__month">
                            {jsDate.getMonth() + 1}
                        </span>
                        <span className="list-item__year">
                            {jsDate.getFullYear()}
                        </span>
                    </time>
                    <picture>
                        {imageMapThumbnail.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={image?.mimeType}
                            />
                        ))}
                        <img
                            src={image?.url || DEFAULT_BG}
                            role="presentation"
                            alt=""
                            className="list-item__image"
                        />
                    </picture>
                </Link>
            </figure>

            <div>
                <h2 className="list-item__title">
                    <Link
                        to={link}
                        title={title}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                </h2>

                <div
                    className="list-item__description"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />

                <Tags items={tags} prefix={`list-item__${title}`} />
            </div>
        </div>
    )
}
