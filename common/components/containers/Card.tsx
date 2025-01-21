import React, { PropsWithChildren } from 'react'
import Link from 'next/link'

/* Helpers */
import { joinClassNames } from '../../utils/string'
import { removeURLProtocol } from '../../utils/string'
import { ShortMonthNames } from '../../constants/datetime'
/* Assets */
import '../../scss/card.scss'

type Props = {
    readonly to: string
    readonly title?: string
    readonly description?: string
    readonly time?: number
    readonly image: string
    readonly className?: string
}

/**
 * Card component that displays a card with an image, title, description, and optional time.
 *
 * @param {ReactNode} props.children - The content to display in the card.
 * @param {string} props.to - The URL to link to.
 * @param {string} [props.title] - The title of the card.
 * @param {string} [props.description] - The description of the card.
 * @param {number} [props.time] - The timestamp to display on the card.
 * @param {string} props.image - The URL of the image to display on the card.
 * @param {string} [props.className] - Additional class names for the card.
 */
export const Card = ({
    children,
    title,
    description,
    to,
    time,
    image,
    className,
}: PropsWithChildren<Props>) => {
    const datetime = time && new Date(time)
    return (
        <section className={joinClassNames('card', className)}>
            <figure className="card__thumbnail">
                <Link title={title || ''} href={to}>
                    <div className="card__thumbnail__zoom"></div>
                    <div className="card__thumbnail__shadow"></div>
                    {datetime && (
                        <time
                            className="card__time"
                            dateTime={datetime.toISOString()}
                        >
                            <span className="card__time__day">
                                {datetime.getDate()}
                            </span>
                            <span className="card__time__month">
                                {ShortMonthNames[datetime.getMonth()]}
                            </span>
                            <span className="card__time__year">
                                {datetime.getFullYear()}
                            </span>
                        </time>
                    )}
                    <picture className="card__image__container">
                        <img
                            src={removeURLProtocol(image)}
                            role="presentation"
                            alt={title}
                            className="card__image"
                        />
                    </picture>
                </Link>
            </figure>
            {title && (
                <div className="card__text">
                    <h2 className="card__title">
                        <Link title={title} href={to} className="card__link">
                            {title}
                        </Link>
                    </h2>
                    {description && (
                        <p className="card__description">{description}</p>
                    )}
                    {children && children}
                </div>
            )}
        </section>
    )
}
