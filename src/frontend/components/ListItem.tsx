import React from 'react'
import { ImageType } from 'src/constants/wp'
import DEFAULT_BG from 'src/assets/images/thumbnail.svg'

import { Link } from 'src/frontend/components/Link'
import { Tags } from 'src/frontend/components/Tags'
import { Post } from 'src/types/wordpress'
import { getImageMap } from 'src/utils/common'
import { getShortMonthName } from 'src/common/utils/datetime'

interface Props {
    item: Post
    thumbnailKey?: {
        desktop?: 'large' | 'medium' | 'small' | 'tiny'
        mobile?: 'large' | 'medium' | 'small' | 'tiny'
    }
    className?: string
}

export const ListItem = (props: Props): JSX.Element => {
    const {
        item: { title, link, excerpt, tags, images },
        className,
    } = props

    const date = new Date(props.item.date)
    const image = images.list || images.thumbnail
    const imageMapThumbnail = image
        ? getImageMap(ImageType.HEADER, image.sizes)
        : []

    return (
        <div className={`list-item ${className || ''}`}>
            <figure className="list-item__thumbnail">
                <Link to={link} title={title}>
                    <div className="list-item__zoom" />
                    <div className="list-item__shadow" />
                    <time
                        className="list-item__time"
                        dateTime={date.toString()}
                    >
                        <span className="list-item__day">{date.getDate()}</span>
                        <span className="list-item__month">
                            {getShortMonthName(date)}
                        </span>
                        <span className="list-item__year">
                            {date.getFullYear()}
                        </span>
                    </time>
                    <picture className="list-item__image__container">
                        {imageMapThumbnail.map((map) => (
                            <source
                                key={`header-${map.file}`}
                                media={map.key}
                                srcSet={map.file}
                                type={image?.mimeType || 'image/jpeg'}
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
